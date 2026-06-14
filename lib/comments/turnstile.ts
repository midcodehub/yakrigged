/**
 * Cloudflare Turnstile 服务端校验
 * --------------------------------------------------
 * 前端把 widget 产生的 token 随发帖请求带上,服务端在这里向
 * Cloudflare 验真,确认是真人浏览器而非脚本。
 *
 * 未配置 TURNSTILE_SECRET_KEY 时降级为"放行"(本地开发友好),
 * 与站点其它"没配 env 就降级"的约定一致。
 */
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(
  token: string | null | undefined,
  ip?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // 未配置 → 降级放行
  if (!token) return false;

  try {
    const form = new URLSearchParams();
    form.append('secret', secret);
    form.append('response', token);
    if (ip && ip !== 'unknown') form.append('remoteip', ip);

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // 网络异常时保守判失败(发帖会被拒,用户可重试),避免被绕过
    return false;
  }
}
