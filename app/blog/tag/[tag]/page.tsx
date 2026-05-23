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

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Blog', href: '/blog' },
          { label: `#${tag}` },
        ]}
      />
      <header className="mb-10">
        <p className="text-sm uppercase tracking-wider text-brand-600">
          Tag archive
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink-900 sm:text-4xl">
          #{tag}
        </h1>
        <p className="mt-3 text-ink-700">
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
    </>
  );
}
