/**
 * Upstash Redis 限流
 * --------------------------------------------------
 * 对应 subscribe 里"限流需 KV/Redis"的 TODO,这里正式落地。
 * 双键限流:既限 IP(防一人海量灌水),也限 uid(防换 IP 绕过)。
 *
 * 未配置 Upstash env 时降级为"放行"(本地开发友好),仅打一次警告。
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let postLimiter: Ratelimit | null = null;
let reactLimiter: Ratelimit | null = null;
let warned = false;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (!warned) {
      console.warn('[comments] 未配置 Upstash,限流已降级为放行(仅开发可接受)');
      warned = true;
    }
    return null;
  }
  return new Redis({ url, token });
}

function getPostLimiter(): Ratelimit | null {
  if (postLimiter) return postLimiter;
  const redis = getRedis();
  if (!redis) return null;
  // 发帖:每 10 分钟 5 条(滑动窗口)
  postLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '600 s'),
    prefix: 'cmt:post',
    analytics: false,
  });
  return postLimiter;
}

function getReactLimiter(): Ratelimit | null {
  if (reactLimiter) return reactLimiter;
  const redis = getRedis();
  if (!redis) return null;
  // 点赞/踩:每分钟 30 次,够正常浏览,挡住脚本刷票
  reactLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '60 s'),
    prefix: 'cmt:react',
    analytics: false,
  });
  return reactLimiter;
}

/** 发帖限流:任一维度超限即拒。未配置时恒放行。 */
export async function checkPostRateLimit(
  ipHash: string,
  userId: string,
): Promise<boolean> {
  const limiter = getPostLimiter();
  if (!limiter) return true;
  const [a, b] = await Promise.all([
    limiter.limit(`ip:${ipHash}`),
    limiter.limit(`uid:${userId}`),
  ]);
  return a.success && b.success;
}

/** 点赞/踩限流 */
export async function checkReactRateLimit(userId: string): Promise<boolean> {
  const limiter = getReactLimiter();
  if (!limiter) return true;
  const { success } = await limiter.limit(`uid:${userId}`);
  return success;
}
