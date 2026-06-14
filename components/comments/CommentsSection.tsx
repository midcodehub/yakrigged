'use client';

/**
 * 留言区主容器 —— 数据中枢
 * --------------------------------------------------
 * 负责拉取/建树/状态管理,把回调透传给 CommentItem / CommentComposer。
 * 替换原 Giscus,挂在文章页底部。
 *
 * 设计语言沿用站点:白底卡片 + ring-sand-200 + 圆角。
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PublicComment, ReactionKind } from '@/lib/comments/types';
import {
  deleteComment,
  editComment,
  fetchComments,
  postComment,
  reactComment,
  type ApiEnvelope,
} from './api';
import { CommentComposer } from './CommentComposer';
import { CommentItem, type CommentNode } from './CommentItem';

function buildTree(flat: PublicComment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  flat.forEach((c) => map.set(c.id, { ...c, children: [] }));
  const roots: CommentNode[] = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  // 顶层:置顶优先,然后最新在前;回复:从旧到新
  roots.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const sortReplies = (n: CommentNode) => {
    n.children.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    n.children.forEach(sortReplies);
  };
  roots.forEach(sortReplies);
  return roots;
}

export function CommentsSection({ slug }: { slug: string }) {
  const [flat, setFlat] = useState<PublicComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchComments(slug)
      .then(({ comments, configured }) => {
        if (!active) return;
        setFlat(comments);
        setConfigured(configured);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  const tree = useMemo(() => buildTree(flat), [flat]);
  const count = flat.filter((c) => c.body !== '[deleted]').length;

  const patchOne = useCallback(
    (id: string, patch: Partial<PublicComment>) =>
      setFlat((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    [],
  );

  const onReact = useCallback(
    async (id: string, kind: ReactionKind) => {
      const res = await reactComment(id, kind);
      if (res.ok && res.data) {
        patchOne(id, {
          likeCount: res.data.likeCount,
          dislikeCount: res.data.dislikeCount,
          myReaction: res.data.myReaction,
        });
      }
    },
    [patchOne],
  );

  const submit = useCallback(
    async (
      parentId: string | null,
      args: { body: string; name: string | null; token?: string; website?: string },
    ): Promise<ApiEnvelope<PublicComment | null>> => {
      const res = await postComment({
        slug,
        parentId,
        body: args.body,
        authorName: args.name,
        turnstileToken: args.token,
        website: args.website,
      });
      if (res.ok && res.status === 'approved' && res.data) {
        setFlat((prev) => [...prev, res.data as PublicComment]);
      }
      return res;
    },
    [slug],
  );

  const onEdit = useCallback(
    async (id: string, body: string): Promise<ApiEnvelope> => {
      const res = await editComment(id, body);
      if (res.ok && res.status === 'approved') {
        patchOne(id, { body });
      } else if (res.ok && res.status !== 'approved') {
        // 编辑后变成 pending/rejected → 从公开列表移除并提示
        setFlat((prev) => prev.filter((c) => c.id !== id));
        setNotice(
          res.status === 'pending'
            ? 'Your edited comment is awaiting review.'
            : 'Your edited comment was flagged and hidden.',
        );
      }
      return res;
    },
    [patchOne],
  );

  const onDelete = useCallback(async (id: string) => {
    const res = await deleteComment(id);
    if (res.ok) patchOne(id, { body: '[deleted]', isMine: false });
  }, [patchOne]);

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-semibold text-ink-900">
        Comments {count > 0 && <span className="text-ink-400">({count})</span>}
      </h2>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sand-200 sm:p-6">
        {!configured ? (
          <p className="py-6 text-center text-sm text-ink-500">
            💬 Comments are coming soon.
          </p>
        ) : (
          <>
            <CommentComposer onSubmit={(args) => submit(null, args)} />

            <p className="mt-2 text-xs text-ink-400">
              Be kind and stay on topic. By posting you agree to our{' '}
              <a href="/privacy" className="underline hover:text-ink-600">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/terms" className="underline hover:text-ink-600">
                Terms
              </a>
              .
            </p>

            {notice && (
              <p className="mt-4 rounded-lg bg-sand-50 px-3 py-2 text-sm text-ink-600">
                {notice}
              </p>
            )}

            <div className="mt-6 space-y-5">
              {loading && <p className="text-sm text-ink-500">Loading comments…</p>}
              {!loading && tree.length === 0 && (
                <p className="text-sm text-ink-500">
                  No comments yet — be the first to share your take.
                </p>
              )}
              {tree.map((node) => (
                <CommentItem
                  key={node.id}
                  node={node}
                  depth={0}
                  onReact={onReact}
                  onReplySubmit={(parentId, args) => submit(parentId, args)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
