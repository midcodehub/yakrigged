/**
 * POST /api/comments/:id/react   点赞 / 踩(再点取消,点反款切换)
 * --------------------------------------------------
 * 一人一票由 reactions 表 (comment_id, voter_id) 主键约束保证;
 * 计数由 DB 触发器在同一事务内原子维护(并发安全)。
 */
import { NextResponse } from 'next/server';
import {
  bearerToken,
  getUserIdFromToken,
  isCommentsConfigured,
} from '@/lib/comments/db';
import { checkReactRateLimit } from '@/lib/comments/ratelimit';
import { reactToComment } from '@/lib/comments/service';
import type { ReactionKind } from '@/lib/comments/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!isCommentsConfigured()) {
    return NextResponse.json({ ok: false, status: 'not_configured' }, { status: 503 });
  }
  const viewer = await getUserIdFromToken(bearerToken(req));
  if (!viewer) {
    return NextResponse.json({ ok: false, status: 'no_session' }, { status: 401 });
  }

  let kind: ReactionKind;
  try {
    kind = (await req.json())?.kind;
  } catch {
    return NextResponse.json({ ok: false, status: 'invalid_request' }, { status: 400 });
  }
  if (kind !== 'like' && kind !== 'dislike') {
    return NextResponse.json(
      { ok: false, status: 'invalid_request', message: 'kind 必须是 like/dislike' },
      { status: 400 },
    );
  }

  if (!(await checkReactRateLimit(viewer.id))) {
    return NextResponse.json({ ok: false, status: 'rate_limited' }, { status: 429 });
  }

  try {
    const data = await reactToComment(params.id, viewer.id, kind);
    return NextResponse.json({ ok: true, status: 'ok', data });
  } catch (e) {
    console.error('[comments] react 失败:', e);
    return NextResponse.json({ ok: false, status: 'server_error' }, { status: 502 });
  }
}
