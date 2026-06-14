/**
 * POST   /api/admin/login   站长用密钥换取 httpOnly cookie
 * DELETE /api/admin/login   退出(清 cookie)
 * --------------------------------------------------
 * P1 轻量网关:校验 COMMENTS_ADMIN_SECRET,种一个 hash 后的 httpOnly cookie。
 */
import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  adminCookieValue,
  checkAdminSecret,
  isAdminConfigured,
} from '@/lib/comments/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, status: 'not_configured', message: '未设置 COMMENTS_ADMIN_SECRET' },
      { status: 503 },
    );
  }
  let secret: string | undefined;
  try {
    secret = (await req.json())?.secret;
  } catch {
    return NextResponse.json({ ok: false, status: 'invalid_request' }, { status: 400 });
  }
  if (!checkAdminSecret(secret)) {
    return NextResponse.json(
      { ok: false, status: 'wrong_secret', message: '密钥错误' },
      { status: 401 },
    );
  }
  const res = NextResponse.json({ ok: true, status: 'logged_in' });
  res.cookies.set(ADMIN_COOKIE_NAME, adminCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 天
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true, status: 'logged_out' });
  res.cookies.set(ADMIN_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return res;
}
