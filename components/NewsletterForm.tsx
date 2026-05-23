/**
 * <NewsletterForm />
 * --------------------------------------------------
 * 客户端表单。三状态：idle / submitting / success / error。
 * 用法：
 *   <NewsletterForm source="footer" />          (默认竖向，深色卡片)
 *   <NewsletterForm source="article" layout="inline" />  (横向，文章末尾用)
 *   <NewsletterForm source="subscribe-page" layout="hero" />  (独立页大号)
 *
 * 注意：
 *  - source prop 会通过 /api/subscribe 传到 Beehiiv 作为 UTM source
 *  - 表单包含蜜罐字段 `website`（视觉隐藏，机器人会填）
 *  - 成功后表单替换为 thank-you 卡片，不重置回 idle（让用户知道操作完成了）
 */
'use client';

import { useState, type FormEvent } from 'react';

interface Props {
  /** 出现位置标识，用于追踪转化 */
  source: 'footer' | 'article' | 'subscribe-page' | 'home';
  /** 视觉变体 */
  layout?: 'card' | 'inline' | 'hero';
  /** 卡片标题（仅 card / hero 用） */
  heading?: string;
  /** 副标题 */
  subheading?: string;
}

type SubmitState =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'success'; pendingConfirmation: boolean }
  | { phase: 'error'; message: string };

export function NewsletterForm({
  source,
  layout = 'card',
  heading = 'Get new rigging guides in your inbox',
  subheading = 'One email a week. Field-tested gear reviews and DIY rigs. Unsubscribe anytime.',
}: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>({ phase: 'idle' });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ phase: 'submitting' });

    // 蜜罐字段：用 FormData 拿，不进 state
    const formData = new FormData(e.currentTarget);
    const honeypot = String(formData.get('website') ?? '');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          website: honeypot,
          source,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        status: string;
        message?: string;
      };

      if (data.ok) {
        setState({
          phase: 'success',
          pendingConfirmation: data.status === 'pending_confirmation',
        });
        return;
      }

      // 已经订阅过的情况——对用户来说也算"成功"
      if (data.status === 'already_subscribed') {
        setState({ phase: 'success', pendingConfirmation: false });
        return;
      }

      // 未配置：友好提示"即将开放"
      if (data.status === 'not_configured') {
        setState({
          phase: 'error',
          message: "Subscriptions aren't open yet — try the RSS feed for now.",
        });
        return;
      }

      setState({
        phase: 'error',
        message: data.message ?? 'Something went wrong. Try again in a minute.',
      });
    } catch {
      setState({
        phase: 'error',
        message: 'Network error. Try again in a minute.',
      });
    }
  }

  // ============== 成功状态：替换整个表单 ==============
  if (state.phase === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className={containerClass(layout, 'success')}
      >
        <p className="text-2xl" aria-hidden>✓</p>
        <p className="mt-1 font-semibold text-ink-900">
          {state.pendingConfirmation
            ? "Almost there — check your inbox."
            : "You're in. See you in your inbox."}
        </p>
        <p className="mt-1 text-sm text-ink-700">
          {state.pendingConfirmation
            ? 'Click the confirmation link to start receiving issues. (Check spam if you don\'t see it.)'
            : 'First issue ships Monday. Reply anytime — every email reaches a real human.'}
        </p>
      </div>
    );
  }

  // ============== 默认 / 提交中 / 错误状态：表单本身 ==============
  return (
    <form
      onSubmit={onSubmit}
      className={containerClass(layout, 'idle')}
      // 让屏幕阅读器把整个表单当作 region 而不是分散控件
      aria-label="Newsletter subscription"
    >
      {layout !== 'inline' && (
        <>
          <p className="text-base font-semibold text-ink-900 sm:text-lg">
            {heading}
          </p>
          <p className="mt-1 text-sm text-ink-700">{subheading}</p>
        </>
      )}

      {/* 蜜罐字段：视觉隐藏但不用 display:none（机器人会跳过 display:none） */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '-9999px',
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
      >
        <label htmlFor={`np-${source}`}>
          Don&apos;t fill this in if you&apos;re human:
        </label>
        <input
          id={`np-${source}`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div
        className={
          layout === 'inline'
            ? 'flex flex-col gap-2 sm:flex-row'
            : 'mt-4 flex flex-col gap-2 sm:flex-row'
        }
      >
        <label htmlFor={`email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          disabled={state.phase === 'submitting'}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm outline-none ring-brand-400 focus:ring-2 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state.phase === 'submitting'}
          className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.phase === 'submitting' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>

      {state.phase === 'error' && (
        <p role="alert" className="mt-2 text-sm text-rose-700">
          {state.message}
        </p>
      )}

      <p className="mt-3 text-xs text-ink-500">
        No spam. Powered by Beehiiv. Unsubscribe with one click.
      </p>
    </form>
  );
}

/** 根据 layout + 状态给容器拼 className */
function containerClass(
  layout: 'card' | 'inline' | 'hero',
  phase: 'idle' | 'success',
): string {
  const base =
    phase === 'success' ? 'rounded-lg p-5 text-center' : '';
  if (layout === 'hero') {
    return `${base} rounded-2xl border border-brand-200 bg-white p-8 shadow-sm`;
  }
  if (layout === 'inline') {
    return phase === 'success'
      ? 'rounded-lg border border-brand-200 bg-brand-50 p-5 text-center'
      : '';
  }
  // card（默认）
  return phase === 'success'
    ? 'rounded-lg border border-brand-200 bg-brand-50 p-5 text-center'
    : 'rounded-lg border border-brand-200 bg-white p-4 shadow-sm';
}
