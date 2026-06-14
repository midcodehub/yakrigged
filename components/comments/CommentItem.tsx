'use client';

/**
 * 单条留言 + 递归回复
 * --------------------------------------------------
 * Facebook 风:头像 + 气泡 + 操作行(时间/赞踩/回复/编辑/删除)+ 缩进的子回复。
 */
import { useState } from 'react';
import type { AuthorType, PublicComment, ReactionKind } from '@/lib/comments/types';
import type { ApiEnvelope } from './api';
import { CommentBody } from './CommentBody';
import { CommentComposer } from './CommentComposer';
import { VoteButtons } from './VoteButtons';

export interface CommentNode extends PublicComment {
  children: CommentNode[];
}

const AVATAR_COLORS = [
  'bg-brand-600',
  'bg-accent-600',
  'bg-emerald-600',
  'bg-rose-500',
  'bg-amber-600',
  'bg-sky-600',
];

function Avatar({ name, type }: { name: string; type: AuthorType }) {
  const initial = name.replace(/[^\p{L}\p{N}]/gu, '').charAt(0).toUpperCase() || '?';
  // 用名字的字符码选个稳定颜色
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  const color = type === 'admin' ? 'bg-brand-800' : AVATAR_COLORS[idx];
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${color}`}
      aria-hidden
    >
      {initial}
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  return new Date(iso).toLocaleDateString();
}

export function CommentItem({
  node,
  depth,
  onReact,
  onReplySubmit,
  onEdit,
  onDelete,
}: {
  node: CommentNode;
  depth: number;
  onReact: (id: string, kind: ReactionKind) => void;
  onReplySubmit: (
    parentId: string,
    args: { body: string; name: string | null; token?: string },
  ) => Promise<ApiEnvelope<PublicComment | null>>;
  onEdit: (id: string, body: string) => Promise<ApiEnvelope>;
  onDelete: (id: string) => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [editing, setEditing] = useState(false);
  const c = node;
  const isDeleted = c.body === '[deleted]';

  return (
    <div className="flex gap-3">
      <Avatar name={c.authorName} type={c.authorType} />

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl bg-sand-50 px-3.5 py-2.5 ring-1 ring-sand-100">
          <div className="mb-0.5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink-900">{c.authorName}</span>
            {c.authorType === 'admin' && (
              <span className="rounded-full bg-brand-700 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Author
              </span>
            )}
            {c.pinned && (
              <span className="rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-700">
                📌 Pinned
              </span>
            )}
          </div>

          {editing ? (
            <CommentComposer
              compact
              autoFocus
              initialBody={c.body}
              submitLabel="Save"
              placeholder="Edit your comment…"
              onSubmit={async ({ body }) => {
                const res = await onEdit(c.id, body);
                if (res.ok) setEditing(false);
                return res;
              }}
              onCancel={() => setEditing(false)}
            />
          ) : isDeleted ? (
            <p className="text-sm italic text-ink-400">This comment was deleted.</p>
          ) : (
            <CommentBody text={c.body} />
          )}
        </div>

        {!isDeleted && !editing && (
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 pl-1 text-xs text-ink-500">
            <span>{timeAgo(c.createdAt)}</span>
            <VoteButtons
              likeCount={c.likeCount}
              dislikeCount={c.dislikeCount}
              myReaction={c.myReaction}
              onReact={(k) => onReact(c.id, k)}
            />
            <button
              type="button"
              onClick={() => setShowReply((s) => !s)}
              className="font-medium hover:text-ink-900"
            >
              Reply
            </button>
            {c.isMine && (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="font-medium hover:text-ink-900"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this comment?')) onDelete(c.id);
                  }}
                  className="font-medium hover:text-rose-600"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}

        {showReply && (
          <CommentComposer
            compact
            autoFocus
            submitLabel="Reply"
            placeholder={`Reply to ${c.authorName}…`}
            onSubmit={async (args) => {
              const res = await onReplySubmit(c.id, args);
              if (res.ok && (res.status === 'approved' || res.status === 'pending')) {
                setShowReply(false);
              }
              return res;
            }}
            onCancel={() => setShowReply(false)}
          />
        )}

        {c.children.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-sand-100 pl-3 sm:pl-4">
            {c.children.map((child) => (
              <CommentItem
                key={child.id}
                node={child}
                depth={depth + 1}
                onReact={onReact}
                onReplySubmit={onReplySubmit}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
