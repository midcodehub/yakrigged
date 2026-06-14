/**
 * GET  /api/comments?slug=...   列出某文章的已审留言
 * POST /api/comments            发表留言/回复
 * --------------------------------------------------
 * 沿用 /api/subscribe 的约定:nodejs runtime、force-dynamic、
 * 统一 {ok,status,message} 返回、蜜罐字段。
 */
import { NextResponse } from 'next/server';
import {
  bearerToken,
  clientIp,
  hashIp,
  getUserIdFromToken,
  isCommentsConfigured,
} from '@/lib/comments/db';
import { checkPostRateLimit } from '@/lib/comments/ratelimit';
import { verifyTurnstile } from '@/lib/comments/turnstile';
import { isAdminRequest } from '@/lib/comments/admin';
import { listComments, createComment } from '@/lib/comments/service';
import type { AuthorType } from '@/lib/comments/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function notConfigured() {
  return NextResponse.json(
    { ok: false, status: 'not_configured', message: '留言系统未配置' },
    { status: 503 },
  );
}

export async function GET(req: Request) {
  if (!isCommentsConfigured()) {
    // 未配置时返回空列表 + not_configured,前端据此显示降级提示
    return NextResponse.json({ ok: true, status: 'not_configured', data: [] });
  }
  const slug = new URL(req.url).searchParams.get('slug');
  if (!slug) {
    return NextResponse.json(
      { ok: false, status: 'invalid_request', message: '缺少 slug' },
      { status: 400 },
    );
  }
  // 有 token 就解析出访客 uid(用于标注"我的留言/我的投票"),没有也能看
  const viewer = await getUserIdFromToken(bearerToken(req));
  try {
    const data = await listComments(slug, viewer?.id ?? null);
    return NextResponse.json({ ok: true, status: 'ok', data });
  } catch (e) {
    console.error('[comments] list 失败:', e);
    return NextResponse.json(
      { ok: false, status: 'server_error', message: '读取留言失败' },
      { status: 502 },
    );
  }
}

interface PostBody {
  slug?: string;
  parentId?: string | null;
  body?: string;
  authorName?: string | null;
  turnstileToken?: string;
  website?: string; // 蜜罐
}

export async function POST(req: Request) {
  if (!isCommentsConfigured()) return notConfigured();

  let payload: PostBody;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, status: 'invalid_request', message: '请求体不是合法 JSON' },
      { status: 400 },
    );
  }

  // 1. 蜜罐:真人不会填 website,机器人常填 → 静默"成功"
  if (payload.website && payload.website.trim().length > 0) {
    return NextResponse.json({ ok: true, status: 'approved' });
  }

  // 2. 必填校验
  const slug = payload.slug?.trim();
  const body = payload.body?.trim();
  if (!slug || !body) {
    return NextResponse.json(
      { ok: false, status: 'invalid_request', message: '缺少 slug 或留言内容' },
      { status: 400 },
    );
  }
  if (body.length > 4000) {
    return NextResponse.json(
      { ok: false, status: 'too_long', message: '留言过长(上限 4000 字)' },
      { status: 400 },
    );
  }

  // 3. 身份:必须有已验证的会话 uid
  const viewer = await getUserIdFromToken(bearerToken(req));
  if (!viewer) {
    return NextResponse.json(
      { ok: false, status: 'no_session', message: '会话失效,请刷新重试' },
      { status: 401 },
    );
  }

  // 4. 人机验证
  const ip = clientIp(req);
  const human = await verifyTurnstile(payload.turnstileToken, ip);
  if (!human) {
    return NextResponse.json(
      { ok: false, status: 'turnstile_failed', message: '人机验证未通过,请重试' },
      { status: 403 },
    );
  }

  // 5. 限流(IP + uid 双键)
  const ipHash = hashIp(ip);
  const allowed = await checkPostRateLimit(ipHash, viewer.id);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, status: 'rate_limited', message: '发言太频繁,请稍后再试' },
      { status: 429 },
    );
  }

  // 6. 站长身份 → author_type=admin(带作者徽章)
  const authorType: AuthorType = isAdminRequest(req) ? 'admin' : 'anon';

  try {
    const result = await createComment({
      slug,
      parentId: payload.parentId ?? null,
      body,
      authorName: payload.authorName?.trim() || null,
      authorId: viewer.id,
      authorType,
      ipHash,
    });
    // status: approved(已公开,回传可渲染对象)| pending(进队列)| rejected(被拒)
    return NextResponse.json({
      ok: true,
      status: result.status,
      data: result.comment,
    });
  } catch (e) {
    console.error('[comments] create 失败:', e);
    return NextResponse.json(
      { ok: false, status: 'server_error', message: '发表失败,请重试' },
      { status: 502 },
    );
  }
}
