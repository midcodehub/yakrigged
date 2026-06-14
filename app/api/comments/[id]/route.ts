/**
 * PATCH  /api/comments/:id   编辑自己的留言
 * DELETE /api/comments/:id   软删自己的留言
 * --------------------------------------------------
 * 归属校验在 service 层(比对 author_id 与已验证 uid),不靠前端藏按钮。
 */
import { NextResponse } from 'next/server';
import {
  bearerToken,
  getUserIdFromToken,
  isCommentsConfigured,
} from '@/lib/comments/db';
import { editOwnComment, softDeleteOwnComment } from '@/lib/comments/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Ctx {
  params: { id: string };
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!isCommentsConfigured()) {
    return NextResponse.json({ ok: false, status: 'not_configured' }, { status: 503 });
  }
  const viewer = await getUserIdFromToken(bearerToken(req));
  if (!viewer) {
    return NextResponse.json({ ok: false, status: 'no_session' }, { status: 401 });
  }

  let body: string | undefined;
  try {
    body = (await req.json())?.body?.trim();
  } catch {
    return NextResponse.json({ ok: false, status: 'invalid_request' }, { status: 400 });
  }
  if (!body) {
    return NextResponse.json(
      { ok: false, status: 'invalid_request', message: '内容不能为空' },
      { status: 400 },
    );
  }

  const result = await editOwnComment(params.id, viewer.id, body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, status: 'forbidden', message: '只能编辑自己的留言' },
      { status: 403 },
    );
  }
  return NextResponse.json({ ok: true, status: result.status });
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!isCommentsConfigured()) {
    return NextResponse.json({ ok: false, status: 'not_configured' }, { status: 503 });
  }
  const viewer = await getUserIdFromToken(bearerToken(req));
  if (!viewer) {
    return NextResponse.json({ ok: false, status: 'no_session' }, { status: 401 });
  }
  const ok = await softDeleteOwnComment(params.id, viewer.id);
  if (!ok) {
    return NextResponse.json(
      { ok: false, status: 'forbidden', message: '只能删除自己的留言' },
      { status: 403 },
    );
  }
  return NextResponse.json({ ok: true, status: 'deleted' });
}
