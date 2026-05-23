/**
 * POST /api/subscribe
 * --------------------------------------------------
 * 前端 NewsletterForm 调这一个端点，它把请求转发给 newsletter provider。
 *
 * 为什么不让前端直接调 Beehiiv：
 *  - API key 必须留在服务端
 *  - 集中处理 honeypot / rate limit / 日志
 *  - 换 provider 时前端 0 改动
 */
import { NextResponse } from 'next/server';
import { subscribe } from '@/lib/newsletter';

export const runtime = 'nodejs'; // 用 Node runtime 以便用 fetch + AbortSignal.timeout
export const dynamic = 'force-dynamic'; // POST 不能被 SSG 缓存

interface RequestBody {
  email?: string;
  /** 蜜罐：真实用户应该留空，机器人会填 */
  website?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export async function POST(req: Request) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, status: 'invalid_request', message: '请求体不是合法 JSON' },
      { status: 400 },
    );
  }

  // 1. 蜜罐字段 —— 真人不会填，机器人通常会
  if (body.website && body.website.trim().length > 0) {
    // 静默"成功"，不让爬虫知道被识别了
    return NextResponse.json({ ok: true, status: 'subscribed' });
  }

  // 2. 必填校验
  if (typeof body.email !== 'string' || body.email.trim().length === 0) {
    return NextResponse.json(
      { ok: false, status: 'invalid_email', message: '请填写邮箱' },
      { status: 400 },
    );
  }

  // 3. 简单 rate limit —— 用 IP 做 key 的方案需要 KV/Redis，
  //    Vercel 内建 Edge Config 也可。这一版先靠 Beehiiv 自带的 60/min 限流兜底，
  //    等真实流量上来再加。

  const result = await subscribe(body.email.trim().toLowerCase(), {
    source: body.source,
    utmSource: body.utm_source,
    utmMedium: body.utm_medium,
    utmCampaign: body.utm_campaign,
    referringSite: req.headers.get('referer') ?? undefined,
  });

  // HTTP 状态码语义化：成功 200，不可恢复错误 400，服务问题 503
  const httpStatus = result.ok
    ? 200
    : result.status === 'invalid_email' || result.status === 'already_subscribed'
      ? 400
      : result.status === 'not_configured'
        ? 503
        : 502;

  return NextResponse.json(result, { status: httpStatus });
}
