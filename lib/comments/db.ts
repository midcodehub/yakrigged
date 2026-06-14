/**
 * 服务端 Supabase 管理客户端(service_role)+ 身份/工具
 * --------------------------------------------------
 * service_role 会【绕过 RLS】,只能在服务端 Route Handler 里用,
 * 绝不能进客户端 bundle(env 名没有 NEXT_PUBLIC_ 前缀,天然隔离)。
 *
 * 所有评论的增删改查都经由这个 client,在做完 Turnstile / 限流 / 审核后执行。
 */
import { createHash } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

export function isCommentsConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/** service_role 单例;未配置时抛错(调用方应先用 isCommentsConfigured 兜底) */
export function getAdminSupabase(): SupabaseClient {
  if (adminClient) return adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('[comments] 缺少 SUPABASE_URL / SERVICE_ROLE_KEY 环境变量');
  }
  adminClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

/**
 * 用客户端传来的 access_token 验签,拿到可信的 uid。
 * 失败返回 null(token 缺失/过期/伪造)。
 */
export async function getUserIdFromToken(
  token: string | null,
): Promise<{ id: string; email: string | null } | null> {
  if (!token) return null;
  const { data, error } = await getAdminSupabase().auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}

/** 从 Request 取 Bearer token */
export function bearerToken(req: Request): string | null {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice('Bearer '.length).trim() || null;
}

/** 取客户端 IP(Vercel 会带 x-forwarded-for) */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/** IP 只存 hash —— 限流/审计够用,又不留明文 PII */
export function hashIp(ip: string): string {
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'yakrigged';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}
