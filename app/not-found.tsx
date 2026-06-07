/**
 * 全局 404 —— Next.js App Router 约定，根目录的 not-found.tsx
 * 会自动用作所有未匹配路由的 404 页面。
 */
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <svg aria-hidden viewBox="0 0 64 64" className="mx-auto h-16 w-16">
        <rect width="64" height="64" rx="14" fill="#1a564b" />
        <path d="M32 12 C 40 20, 40 44, 32 52 C 24 44, 24 20, 32 12 Z" fill="#f7f4ee" />
        <ellipse cx="32" cy="32" rx="3" ry="5.2" fill="#1a564b" />
        <line x1="15" y1="41" x2="49" y2="23" stroke="#f4a45f" strokeWidth="3.4" strokeLinecap="round" />
      </svg>
      <p className="mt-5 font-display text-5xl font-semibold text-ink-900">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-ink-900">
        We can&apos;t find that page.
      </h1>
      <p className="mt-2 text-ink-600">
        Maybe the rod holder install washed it overboard.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-brand-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-brand-600"
      >
        Back to home
      </Link>
    </div>
  );
}
