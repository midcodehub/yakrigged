/**
 * /search
 * 仅一个 server component 外壳，真正的输入/匹配在 <SearchClient />。
 * 这样 server 端只跑一遍 metadata 渲染，搜索本身完全客户端化，零接口成本。
 */
import type { Metadata } from 'next';
import { SearchClient } from '@/components/SearchClient';

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search YakRigged for gear reviews, rigging guides, and destination notes.',
  alternates: { canonical: '/search' },
  // 搜索结果页通常不想被索引（query 字段会产生无穷 URL）
  robots: { index: false, follow: true },
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <section className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">Search</h1>
        <p className="mt-2 text-ink-700">
          Type any keyword. We index the title, description, category, tags,
          author, and the first ~800 chars of body text.
        </p>
      </header>

      <SearchClient initialQuery={searchParams.q ?? ''} />
    </section>
  );
}
