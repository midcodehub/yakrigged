'use client';

/**
 * 点赞 / 踩 按钮
 * --------------------------------------------------
 * 高亮当前访客投过的票;再点同款取消、点反款切换(逻辑在服务端)。
 */
import type { ReactionKind } from '@/lib/comments/types';

export function VoteButtons({
  likeCount,
  dislikeCount,
  myReaction,
  onReact,
  disabled,
}: {
  likeCount: number;
  dislikeCount: number;
  myReaction: ReactionKind | null;
  onReact: (kind: ReactionKind) => void;
  disabled?: boolean;
}) {
  const base =
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50';
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={disabled}
        aria-pressed={myReaction === 'like'}
        onClick={() => onReact('like')}
        className={`${base} ${
          myReaction === 'like'
            ? 'bg-brand-100 text-brand-800 ring-1 ring-brand-300'
            : 'text-ink-500 hover:bg-sand-100'
        }`}
      >
        <span aria-hidden>👍</span>
        <span>{likeCount}</span>
      </button>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={myReaction === 'dislike'}
        onClick={() => onReact('dislike')}
        className={`${base} ${
          myReaction === 'dislike'
            ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-300'
            : 'text-ink-500 hover:bg-sand-100'
        }`}
      >
        <span aria-hidden>👎</span>
        <span>{dislikeCount}</span>
      </button>
    </div>
  );
}
