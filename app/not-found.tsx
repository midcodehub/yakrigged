/**
 * 全局 404 —— Next.js App Router 约定，根目录的 not-found.tsx
 * 会自动用作所有未匹配路由的 404 页面。
 */
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <p className="text-6xl">🛶</p>
      <h1 className="mt-4 text-3xl font-bold text-ink-900">
        We can&apos;t find that page.
      </h1>
      <p className="mt-2 text-ink-700">
        Maybe the rod holder install washed it overboard.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
      >
        Back to home
      </Link>
    </div>
  );
}
