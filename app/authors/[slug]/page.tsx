/**
 * 作者档案页 /authors/[slug]
 * ----------------------------------------------------------
 * - 显示 bio / 专业领域 / 社交链接
 * - 列出该作者全部文章
 * - 输出 Person schema.org JSON-LD（强化 E-E-A-T）
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar } from '@/components/Avatar';
import { BlogCard } from '@/components/BlogCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  getAllAuthors,
  getPostsByAuthor,
} from '@/lib/posts';
import { getAuthorBySlug } from '@/lib/authors';
import { SITE } from '@/lib/consts';

interface Params {
  slug: string;
}

export function generateStaticParams() {
  // 仅给在 lib/authors.ts 里有档案的作者生成路由；
  // 否则空 bio 页对 SEO 是反信号。
  return getAllAuthors()
    .filter((a) => getAuthorBySlug(a.slug))
    .map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const author = getAuthorBySlug(params.slug);
  if (!author) return { title: 'Author not found' };
  return {
    title: author.name,
    description: `${author.title}. Articles and reviews by ${author.name} on ${SITE.name}.`,
    alternates: { canonical: `/authors/${params.slug}` },
    openGraph: {
      type: 'profile',
      title: author.name,
      description: author.title,
      url: `/authors/${params.slug}`,
    },
  };
}

export default function AuthorPage({ params }: { params: Params }) {
  const author = getAuthorBySlug(params.slug);
  if (!author) notFound();
  const posts = getPostsByAuthor(params.slug);

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    url: new URL(`/authors/${params.slug}`, SITE.url).toString(),
    image: author.avatar
      ? new URL(author.avatar, SITE.url).toString()
      : undefined,
    sameAs: author.links
      ? Object.values(author.links).filter(Boolean)
      : undefined,
    knowsAbout: author.expertise,
    worksFor: { '@type': 'Organization', name: SITE.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <Breadcrumbs items={[{ label: 'Authors' }, { label: author.name }]} />

      <header className="mb-12 flex flex-col items-start gap-6 sm:flex-row">
        {/* 有头像走 next/image，没头像走 initials 占位 —— 都从 <Avatar /> 走 */}
        <Avatar src={author.avatar} name={author.name} size={96} />
        <div>
          <p className="text-sm uppercase tracking-wider text-brand-600">
            Author profile
          </p>
          <h1 className="mt-1 text-3xl font-bold text-ink-900 sm:text-4xl">
            {author.name}
          </h1>
          <p className="mt-1 text-ink-700">{author.title}</p>

          {author.expertise && author.expertise.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {author.expertise.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-brand-200 px-3 py-1 text-xs text-brand-700"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {author.links && (
            <ul className="mt-4 flex flex-wrap gap-4 text-sm">
              {Object.entries(author.links)
                .filter(([, url]) => Boolean(url))
                .map(([platform, url]) => (
                  <li key={platform}>
                    <a
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 hover:underline"
                    >
                      {platform}
                    </a>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </header>

      <section className="prose prose-lg max-w-none">
        <h2 className="!mt-0">Bio</h2>
        <p>{author.bio}</p>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-ink-900">
          Articles by {author.name}
        </h2>
        {posts.length === 0 ? (
          <p className="text-ink-500">No articles yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        )}
        <p className="mt-8 text-sm">
          <Link href="/blog" className="text-brand-700 hover:underline">
            ← back to all articles
          </Link>
        </p>
      </section>
    </>
  );
}
