'use client';

/**
 * 留言/回复输入框
 * --------------------------------------------------
 * 顶层留言和回复都复用它。包含:
 *   - 昵称(可选,记到 localStorage,回头还是同一个名)
 *   - 正文 textarea
 *   - emoji 选择器(emoji-mart,光标处插入)
 *   - Turnstile(配置了 site key 才出现,过了才能提交)
 *   - 提交后按 approved / pending / rejected 给不同提示
 */
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { ApiEnvelope } from './api';
import { TurnstileWidget } from './TurnstileWidget';

const EmojiPicker = dynamic(() => import('./EmojiPicker'), { ssr: false });

const NAME_KEY = 'yr_comment_name';
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Notice = { type: 'ok' | 'pending' | 'warn' | 'error'; text: string } | null;

export function CommentComposer({
  onSubmit,
  compact = false,
  autoFocus = false,
  placeholder = 'Share your experience or ask a question…',
  submitLabel = 'Post comment',
  initialBody = '',
  onCancel,
}: {
  onSubmit: (args: {
    body: string;
    name: string | null;
    token?: string;
  }) => Promise<ApiEnvelope>;
  compact?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  submitLabel?: string;
  /** 编辑模式下回填当前内容 */
  initialBody?: string;
  onCancel?: () => void;
}) {
  const [name, setName] = useState('');
  const [body, setBody] = useState(initialBody);
  const [token, setToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY);
      if (saved) setName(saved);
    } catch {
      /* localStorage 不可用时忽略 */
    }
  }, []);

  function insertEmoji(native: string) {
    const el = textareaRef.current;
    if (!el) {
      setBody((b) => b + native);
      return;
    }
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = body.slice(0, start) + native + body.slice(end);
    setBody(next);
    setShowPicker(false);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + native.length;
      el.setSelectionRange(pos, pos);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || submitting) return;
    if (SITE_KEY && !token) {
      setNotice({ type: 'warn', text: 'Please complete the verification first.' });
      return;
    }
    setSubmitting(true);
    setNotice(null);

    const trimmedName = name.trim();
    try {
      localStorage.setItem(NAME_KEY, trimmedName);
    } catch {
      /* 忽略 */
    }

    const res = await onSubmit({
      body: body.trim(),
      name: trimmedName || null,
      token: token ?? undefined,
    });

    setSubmitting(false);
    // 重置 Turnstile(token 一次性),拿新 token
    setToken(null);
    setTurnstileKey((k) => k + 1);

    if (res.ok && res.status === 'approved') {
      setBody('');
      setNotice(null);
    } else if (res.ok && res.status === 'pending') {
      setBody('');
      setNotice({ type: 'pending', text: '✅ Submitted — your comment is awaiting review.' });
    } else if (res.ok && res.status === 'rejected') {
      setNotice({ type: 'warn', text: '⚠️ Your comment was flagged and not published.' });
    } else {
      setNotice({ type: 'error', text: res.message || 'Something went wrong. Please try again.' });
    }
  }

  const noticeColor =
    notice?.type === 'error'
      ? 'text-rose-600'
      : notice?.type === 'warn'
        ? 'text-amber-600'
        : 'text-emerald-600';

  return (
    <form onSubmit={handleSubmit} className={compact ? 'mt-3' : 'mt-2'}>
      {!compact && (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className="mb-2 w-full max-w-xs rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none"
        />
      )}

      <div className="relative rounded-xl border border-sand-200 bg-white focus-within:border-brand-400">
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          autoFocus={autoFocus}
          rows={compact ? 2 : 3}
          maxLength={4000}
          placeholder={placeholder}
          className="block w-full resize-y rounded-xl bg-transparent px-3.5 py-2.5 text-[0.95rem] text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
        <div className="flex items-center justify-between border-t border-sand-100 px-2.5 py-1.5">
          <button
            type="button"
            onClick={() => setShowPicker((s) => !s)}
            aria-label="Add emoji"
            className="rounded-md px-2 py-1 text-lg leading-none hover:bg-sand-100"
          >
            😊
          </button>
          <span className="text-xs text-ink-400">{body.length}/4000</span>
        </div>

        {showPicker && (
          <div className="absolute bottom-12 left-0 z-20 shadow-lg">
            <EmojiPicker onSelect={insertEmoji} />
          </div>
        )}
      </div>

      {SITE_KEY && <TurnstileWidget key={turnstileKey} siteKey={SITE_KEY} onToken={setToken} />}

      {notice && <p className={`mt-2 text-sm ${noticeColor}`}>{notice.text}</p>}

      <div className="mt-2 flex items-center gap-2">
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
        >
          {submitting ? 'Posting…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm text-ink-500 hover:bg-sand-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
