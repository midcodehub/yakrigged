/**
 * 标签聚合页 /blog/tag/[tag]
 * ----------------------------------------------------------
 * 与 /blog?category=xxx（query string）不同，这里走真静态路由，
 * 每个 tag 对应独立可索引 URL，给 Google 提供清晰的"关键词聚合"信号。
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BlogCard } from '@/components/BlogCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  findTagBySlug,
  getAllTags,
  getPostsByTag,
} from '@/lib/posts';
import { SITE } from '@/lib/consts';

interface Params {
  tag: string;
}

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const tag = findTagBySlug(params.tag);
  if (!tag) return { title: 'Tag not found' };
  return {
    title: `#${tag}`,
    description: `All ${SITE.name} articles tagged "${tag}" — kayak fishing gear, guides, and notes.`,
    alternates: { canonical: `/blog/tag/${params.tag}` },
  };
}

export default function TagPage({ params }: { params: Params }) {
  const tag = findTagBySlug(params.tag);
  if (!tag) notFound();
  const posts = getPostsByTag(params.tag);

  // Find related tags: tags that co-occur with this tag in the same articles
  const relatedTagSlugs = new Set<string>();
  for (const post of posts) {
    for (const t of post.data.tags) {
      const slug = t.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (slug !== params.tag) relatedTagSlugs.add(slug);
    }
  }
  const allTags = getAllTags();
  const relatedTags = allTags
    .filter((t) => relatedTagSlugs.has(t.slug))
    .slice(0, 8);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Blog', href: '/blog' },
          { label: `#${tag}` },
        ]}
      />
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
          Tag archive
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-ink-900 sm:text-5xl">
          #{tag}
        </h1>
        <p className="mt-3 text-ink-600">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} ·{' '}
          <Link href="/blog" className="text-brand-700 hover:underline">
            ← back to all posts
          </Link>
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <BlogCard key={p.slug} post={p} />
        ))}
      </div>

      {/* Related tags — cross-linking for crawl depth and topic clustering */}
      {relatedTags.length > 0 && (
        <section className="mt-12 border-t border-sand-200 pt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
            Related topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedTags.map((t) => (
              <Link
                key={t.slug}
                href={`/blog/tag/${t.slug}`}
                className="rounded-full bg-sand-100 px-3 py-1 text-sm text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                #{t.tag}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
