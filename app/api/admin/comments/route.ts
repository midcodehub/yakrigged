/**
 * GET  /api/admin/comments   站长拉待审(pending)队列
 * POST /api/admin/comments   站长操作:approve / spam / delete / pin / unpin
 * --------------------------------------------------
 * 鉴权:isAdminRequest(校验 httpOnly cookie)。非站长一律 401。
 */
import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/comments/admin';
import { isCommentsConfigured } from '@/lib/comments/db';
import { listPending, adminSetStatus, adminSetPinned } from '@/lib/comments/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!isCommentsConfigured()) {
    return NextResponse.json({ ok: false, status: 'not_configured' }, { status: 503 });
  }
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false, status: 'unauthorized' }, { status: 401 });
  }
  const data = await listPending();
  return NextResponse.json({ ok: true, status: 'ok', data });
}

interface ActionBody {
  id?: string;
  action?: 'approve' | 'spam' | 'delete' | 'pin' | 'unpin';
}

export async function POST(req: Request) {
  if (!isCommentsConfigured()) {
    return NextResponse.json({ ok: false, status: 'not_configured' }, { status: 503 });
  }
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false, status: 'unauthorized' }, { status: 401 });
  }

  let body: ActionBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, status: 'invalid_request' }, { status: 400 });
  }
  if (!body.id || !body.action) {
    return NextResponse.json({ ok: false, status: 'invalid_request' }, { status: 400 });
  }

  switch (body.action) {
    case 'approve':
      await adminSetStatus(body.id, 'approved');
      break;
    case 'spam':
      await adminSetStatus(body.id, 'spam');
      break;
    case 'delete':
      await adminSetStatus(body.id, 'deleted');
      break;
    case 'pin':
      await adminSetPinned(body.id, true);
      break;
    case 'unpin':
      await adminSetPinned(body.id, false);
      break;
    default:
      return NextResponse.json({ ok: false, status: 'invalid_action' }, { status: 400 });
  }
  return NextResponse.json({ ok: true, status: 'done' });
}
