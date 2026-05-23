/**
 * Newsletter provider 抽象层
 * --------------------------------------------------
 * 前端永远调 /api/subscribe，不直接调任何第三方。这一层负责把
 * "用户邮箱" 转发给真正的 newsletter 服务（当前是 Beehiiv）。
 *
 * 为什么搞这一层：
 *  - API key 必须留在服务端，不能进客户端 bundle
 *  - 换服务商时只改这一文件，前端 0 改动
 *  - 单元测试时 mock 容易（每个 provider 是一个纯函数）
 */

/** subscribe() 的统一返回值，方便前端按 status 渲染不同 UI */
export type SubscribeResult =
  | { ok: true; status: 'subscribed' | 'pending_confirmation' }
  | { ok: false; status: 'already_subscribed' | 'invalid_email' | 'server_error' | 'not_configured'; message?: string };

/** 调用方给的元信息——会带去 Beehiiv 当作 UTM / 来源 */
export interface SubscribeContext {
  /** 从哪里点订阅按钮的，比如 "footer" / "article-end" / "subscribe-page" */
  source?: string;
  /** UTM 来源（如果是从邮件回链 / 社交链接进来的） */
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  /** 用户进入页面时的 referrer，调用方从 Request.headers 里取 */
  referringSite?: string;
}

/**
 * 统一入口。根据 NEWSLETTER_PROVIDER env 自动分发到对应实现。
 * 没有配置 env 时返回 "not_configured" —— 前端就能渲染 "Coming soon" 状态。
 */
export async function subscribe(
  email: string,
  ctx: SubscribeContext = {},
): Promise<SubscribeResult> {
  // 基础校验：客户端虽然也校验了，这里再过一遍防绕过
  if (!isValidEmail(email)) {
    return { ok: false, status: 'invalid_email', message: '邮箱格式不正确' };
  }

  // 默认 'kit' —— Beehiiv 强制 Stripe KYC 后我们改用 Kit 作为主路线
  const provider = process.env.NEWSLETTER_PROVIDER ?? 'kit';

  switch (provider) {
    case 'kit':
      return subscribeViaKit(email, ctx);
    case 'beehiiv':
      return subscribeViaBeehiiv(email, ctx);
    default:
      // 未来加 buttondown / emailoctopus 等就在这里加 case
      return { ok: false, status: 'not_configured' };
  }
}

/** RFC 5322 简化版 —— 拒绝明显错误，不强求严格符合标准 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/**
 * Beehiiv: https://developers.beehiiv.com/api-reference/subscriptions/create
 * POST /v2/publications/{publication_id}/subscriptions
 *  body: { email, reactivate_existing, send_welcome_email, utm_source, ... }
 *  auth: Authorization: Bearer {API_KEY}
 *  rate limit: 60 req/min（个人订阅完全够）
 */
async function subscribeViaBeehiiv(
  email: string,
  ctx: SubscribeContext,
): Promise<SubscribeResult> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  // 没配 env 就明确告诉前端"功能未开通"，比假装成功更好
  if (!apiKey || !publicationId) {
    return { ok: false, status: 'not_configured' };
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          // 双重确认：发欢迎邮件让用户点链接，符合 GDPR / 反垃圾邮件惯例
          send_welcome_email: true,
          // 重新激活已经退订过的人——他们主动来订就让他们回来
          reactivate_existing: true,
          // 来源追踪：在 Beehiiv 后台能看到不同位置的订阅转化率
          utm_source: ctx.utmSource ?? ctx.source ?? 'yakrigged.com',
          utm_medium: ctx.utmMedium ?? 'website-form',
          utm_campaign: ctx.utmCampaign,
          referring_site: ctx.referringSite,
        }),
        // 避免长时间挂起（Beehiiv 国内访问偶尔慢）
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (res.ok) {
      // Beehiiv 返回 201 含 subscription 对象。status 可能是 active 或 validating
      const data = (await res.json()) as {
        data?: { status?: string };
      };
      const subStatus = data.data?.status;
      return {
        ok: true,
        status: subStatus === 'active' ? 'subscribed' : 'pending_confirmation',
      };
    }

    if (res.status === 409) {
      // 邮箱已存在
      return { ok: false, status: 'already_subscribed', message: '这个邮箱已经订阅了。' };
    }

    if (res.status === 400) {
      return { ok: false, status: 'invalid_email', message: '邮箱被 Beehiiv 拒绝（可能格式不正确）。' };
    }

    // 其他 5xx 或未知错误——记录详情但不暴露给用户
    const text = await res.text().catch(() => '');
    console.error('[newsletter] Beehiiv 返回非预期状态:', res.status, text);
    return { ok: false, status: 'server_error', message: '订阅服务暂时无响应，请稍后再试。' };
  } catch (err) {
    console.error('[newsletter] Beehiiv 请求失败:', err);
    return { ok: false, status: 'server_error', message: '网络错误，请稍后再试。' };
  }
}

/**
 * Kit (前身 ConvertKit): https://developers.kit.com/api-reference
 * POST /v3/forms/{form_id}/subscribe
 *  body: { api_key, email, fields? }
 *  auth: api_key 在 body 里（Kit v3 风格，不在 header）
 *  rate limit: 120 req/min（Kit 文档）
 *
 * 选 v3 不选 v4 的原因：
 *  - v3 用了 10+ 年，稳定到 enterprise 级
 *  - 添加订阅者所需权限最小，api_key（非 api_secret）就够
 *  - 错误码语义跟 Beehiiv 几乎一对一，错误处理代码可以复用思路
 *
 * Kit 不会用 409 表示 "已订阅" —— 它是幂等的，重复订阅同一邮箱也返回 200，
 * 状态字段会显示 'active'（已确认）或 'inactive'（未点确认邮件）。
 */
async function subscribeViaKit(
  email: string,
  ctx: SubscribeContext,
): Promise<SubscribeResult> {
  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId) {
    return { ok: false, status: 'not_configured' };
  }

  try {
    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          email,
          // Kit 没有顶级 utm_* 字段，但支持自定义 fields。
          // 把 source / utm 都塞 fields 里，在 Kit 后台筛选订阅来源用。
          // 注意：这些自定义字段必须先在 Kit dashboard 里"Subscribers → Custom Fields"
          // 提前创建，否则会被静默丢弃（Kit 不会报错）。
          fields: {
            source: ctx.source ?? 'yakrigged.com',
            utm_source: ctx.utmSource,
            utm_medium: ctx.utmMedium,
            utm_campaign: ctx.utmCampaign,
            referring_site: ctx.referringSite,
          },
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (res.ok) {
      // Kit 返回 { subscription: { id, state, ... } }
      // state === 'active' 表示已经点过确认邮件（极少见，新订阅几乎都是 inactive）
      // state === 'inactive' 表示等用户点 double-opt-in 确认邮件
      const data = (await res.json()) as {
        subscription?: { state?: string };
      };
      const state = data.subscription?.state;
      return {
        ok: true,
        status: state === 'active' ? 'subscribed' : 'pending_confirmation',
      };
    }

    if (res.status === 401) {
      // API key 不对 —— 服务端配置问题，不要把细节暴露给用户
      console.error('[newsletter] Kit API key 无效或权限不足');
      return { ok: false, status: 'server_error', message: '订阅服务暂时无响应，请稍后再试。' };
    }

    if (res.status === 400 || res.status === 422) {
      // Kit 把"邮箱格式错误"和"邮箱被屏蔽列表"都用 400/422
      return { ok: false, status: 'invalid_email', message: '这个邮箱不能订阅，请换一个试试。' };
    }

    const text = await res.text().catch(() => '');
    console.error('[newsletter] Kit 返回非预期状态:', res.status, text);
    return { ok: false, status: 'server_error', message: '订阅服务暂时无响应，请稍后再试。' };
  } catch (err) {
    console.error('[newsletter] Kit 请求失败:', err);
    return { ok: false, status: 'server_error', message: '网络错误，请稍后再试。' };
  }
}
