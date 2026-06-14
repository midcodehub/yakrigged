/**
 * 评论系统 —— 客户端 fetch 封装
 * --------------------------------------------------
 * 统一在这里:确保有匿名会话 → 把 access_token 放进 Authorization 头 → 调我们的 API。
 * 组件只管 UI,不碰 fetch 细节。
 */
import { ensureSessionToken } from '@/lib/supabase/client';
import type { PublicComment, ReactionKind } from '@/lib/comments/types';

async function authHeaders(): Promise<Record<string, string>> {
  const token = await ensureSessionToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export interface ApiEnvelope<T = unknown> {
  ok: boolean;
  status: string;
  message?: string;
  data?: T;
}

export async function fetchComments(
  slug: string,
): Promise<{ comments: PublicComment[]; configured: boolean }> {
  const headers = await authHeaders();
  const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`, {
    headers,
    cache: 'no-store',
  });
  const json = (await res.json()) as ApiEnvelope<PublicComment[]>;
  return {
    comments: json.data ?? [],
    configured: json.status !== 'not_configured',
  };
}

export async function postComment(input: {
  slug: string;
  parentId: string | null;
  body: string;
  authorName: string | null;
  turnstileToken?: string;
}): Promise<ApiEnvelope<PublicComment | null>> {
  const headers = await authHeaders();
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function reactComment(
  id: string,
  kind: ReactionKind,
): Promise<ApiEnvelope<{ likeCount: number; dislikeCount: number; myReaction: ReactionKind | null }>> {
  const headers = await authHeaders();
  const res = await fetch(`/api/comments/${id}/react`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ kind }),
  });
  return res.json();
}

export async function editComment(id: string, body: string): Promise<ApiEnvelope> {
  const headers = await authHeaders();
  const res = await fetch(`/api/comments/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ body }),
  });
  return res.json();
}

export async function deleteComment(id: string): Promise<ApiEnvelope> {
  const headers = await authHeaders();
  const res = await fetch(`/api/comments/${id}`, { method: 'DELETE', headers });
  return res.json();
}
