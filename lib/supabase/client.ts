/**
 * Supabase 浏览器客户端(单例)
 * --------------------------------------------------
 * 仅用于客户端组件,职责很窄:
 *   1. 给访客做"无感匿名登录"(signInAnonymously),拿到一个持久 uid + JWT
 *   2. 取 session.access_token,带在请求 Authorization 头里发给我们自己的 API
 *
 * 它【不直接】读写评论数据 —— 所有评论的增删改查都走 /api/comments,
 * 由服务端 service_role 在做完 Turnstile / 限流 / 审核后再落库。
 *
 * 注意:匿名登录需要在 Supabase 后台
 *   Authentication → Sign In / Providers → Anonymous 打开开关。
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

/** 浏览器端是否已配置 Supabase(env 缺失时前端走降级提示,不报错) */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** 拿到浏览器单例 client;未配置时返回 null */
export function getBrowserSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (browserClient) return browserClient;
  browserClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      auth: {
        persistSession: true, // 存 localStorage,刷新后保持同一匿名身份
        autoRefreshToken: true,
      },
    },
  );
  return browserClient;
}

/**
 * 确保有一个会话,返回 access_token。
 * 没有会话时静默做匿名登录 —— 用户全程无感。
 */
export async function ensureSessionToken(): Promise<string | null> {
  const supabase = getBrowserSupabase();
  if (!supabase) return null;

  const { data } = await supabase.auth.getSession();
  if (data.session?.access_token) return data.session.access_token;

  const { data: anon, error } = await supabase.auth.signInAnonymously();
  if (error) {
    // 常见原因:后台没开 Anonymous provider。打日志方便排查。
    console.warn('[comments] 匿名登录失败,请确认 Supabase 已开启 Anonymous provider:', error.message);
    return null;
  }
  return anon.session?.access_token ?? null;
}
