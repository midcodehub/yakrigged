/**
 * 站长后台鉴权(P1 轻量版)
 * --------------------------------------------------
 * P1 还没接 邮箱/OAuth 登录,所以站长身份用一个共享密钥
 * (COMMENTS_ADMIN_SECRET)做轻量网关:
 *   - 站长访问 /admin/comments 输入密钥 → 种一个 httpOnly cookie
 *   - 后台 API 校验该 cookie
 * P2 接入真实登录后会替换为基于身份白名单(COMMENTS_ADMIN_EMAILS)的判断。
 */
import { createHash } from 'node:crypto';

const COOKIE_NAME = 'yr_admin';

export { COOKIE_NAME as ADMIN_COOKIE_NAME };

export function isAdminConfigured(): boolean {
  return Boolean(process.env.COMMENTS_ADMIN_SECRET);
}

/** cookie 里存的不是明文密钥,而是它的 hash,降低泄漏风险 */
export function adminCookieValue(): string {
  const secret = process.env.COMMENTS_ADMIN_SECRET ?? '';
  return createHash('sha256').update(`admin:${secret}`).digest('hex');
}

/** 校验密钥是否正确(登录时用) */
export function checkAdminSecret(input: string | undefined | null): boolean {
  const secret = process.env.COMMENTS_ADMIN_SECRET;
  if (!secret || !input) return false;
  return input === secret;
}

/** 从 Request 的 cookie 判断是否为已登录站长 */
export function isAdminRequest(req: Request): boolean {
  if (!isAdminConfigured()) return false;
  const cookie = req.headers.get('cookie') ?? '';
  const match = cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return false;
  const value = decodeURIComponent(match.slice(COOKIE_NAME.length + 1));
  return value === adminCookieValue();
}
