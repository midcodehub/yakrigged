/**
 * 博客列表页 (/blog)
 * ----------------------------------------------------------
 * - 默认按 pubDate 倒序展示全部非草稿文章
 * - 支持 ?category=reviews|guides|destinations|news URL 过滤
 *
 * 通过 searchParams 直接读 query string，依然是 RSC（构建/请求阶段执行）。
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogCard } from '@/components/BlogCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  getAllPosts,
  getAllTags,
  getCategoryCounts,
  getPostsByCategory,
} from '@/lib/posts';
import { CATEGORIES, type Category } from '@/lib/consts';
import { collectionPageSchema, itemListSchema } from '@/lib/schema';

interface SearchParams {
  category?: string;
}

const CHIPS = [
  { value: '', label: 'All' },
  { value: 'reviews', label: 'Gear Reviews' },
  { value: 'guides', label: 'How-To Guides' },
  { value: 'destinations', label: 'Destinations' },
  { value: 'news', label: 'News' },
] as const;

/** 把 query 里的 category 收敛成合法值，避免 XSS 在 UI 上反射任意字符串 */
function normalizeCategory(raw?: string): Category | null {
  if (!raw) return null;
  return (CATEGORIES as readonly string[]).includes(raw)
    ? (raw as Category)
    : null;
}

export function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Metadata {
  const cat = normalizeCategory(searchParams.category);
  const title = cat ? `${cat[0].toUpperCase() + cat.slice(1)} — Blog` : 'Blog';
  const description = cat
    ? `All ${cat} articles on YakRigged — kayak fishing gear, tested and reviewed by anglers.`
    : 'Kayak fishing gear reviews, how-to guides, and destination notes from the YakRigged team.';
  return {
    title,
    description,
    alternates: {
      canonical: cat ? `/blog?category=${cat}` : '/blog',
    },
  };
}

export default function BlogIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cat = normalizeCategory(searchParams.category);
  const posts = getPostsByCategory(cat);
  const counts = getCategoryCounts();
  const totalCount = getAllPosts().length;

  return (
    <>
      {/* Schema.org: ItemList for carousel + CollectionPage for AI context */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema(posts)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageSchema({
              name: cat
                ? `${cat[0].toUpperCase() + cat.slice(1)} — YakRigged Blog`
                : 'YakRigged Blog',
              description: cat
                ? `All ${cat} articles on YakRigged — kayak fishing gear, tested and reviewed by anglers.`
                : 'Kayak fishing gear reviews, how-to guides, and destination notes from the YakRigged team.',
              url: cat ? `/blog?category=${cat}` : '/blog',
            }),
          ),
        }}
      />
      <header className="mb-10">
        <Breadcrumbs
          items={
            cat
              ? [{ label: 'Blog', href: '/blog' }, { label: cat }]
              : [{ label: 'Blog' }]
          }
        />
        <h1 className="text-4xl font-semibold text-ink-900 sm:text-5xl">
          The YakRigged Blog
        </h1>
        <p className="mt-4 max-w-2xl text-xl leading-relaxed text-ink-600">
          Hand-tested reviews, repair walk-throughs, and water-tested rigging
          ideas. New articles drop most weeks.
        </p>
      </header>

      {/* 分类筛选 chips */}
      <nav aria-label="Filter by category" className="mb-8 flex flex-wrap gap-2">
        {CHIPS.map((c) => {
          const active = (cat ?? '') === c.value;
          const href = c.value ? `/blog?category=${c.value}` : '/blog';
          const count = c.value
            ? counts[c.value as Category] ?? 0
            : totalCount;
          return (
            <Link
              key={c.value || 'all'}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={
                'rounded-full border px-4 py-1.5 text-sm transition-colors ' +
                (active
                  ? 'border-brand-700 bg-brand-700 text-white'
                  : 'border-sand-300 text-ink-700 hover:border-brand-400 hover:text-brand-700')
              }
            >
              {c.label}
              <span className="ml-1 opacity-70">({count})</span>
            </Link>
          );
        })}
      </nav>

      {posts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-sand-300 p-8 text-center text-ink-500">
          No articles in this category yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {/* Popular topics — internal linking for SEO crawl depth + topic signals */}
      <section className="mt-16 border-t border-sand-200 pt-8">
        <h2 className="mb-4 text-xl font-semibold text-ink-900">
          Popular topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {getAllTags()
            .slice(0, 15)
            .map((t) => (
              <Link
                key={t.slug}
                href={`/blog/tag/${t.slug}`}
                className="rounded-full bg-sand-100 px-3 py-1.5 text-sm text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                #{t.tag}
                <span className="ml-1 text-xs opacity-60">({t.count})</span>
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}
