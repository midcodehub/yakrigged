/**
 * 单篇文章动态路由 (/blog/[slug])
 * ----------------------------------------------------------
 * - 用 generateStaticParams 把所有 slug 提前打到构建产物里，全站默认 SSG
 * - 用 next-mdx-remote 的 RSC 版本渲染 MDX 正文
 * - generateMetadata 单独给每篇文章注入 title / description / og 等 SEO 字段
 * - 同时打印 Article JSON-LD，提升富媒体结果概率
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

import { FormattedDate } from '@/components/FormattedDate';
import { BlogCard } from '@/components/BlogCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { mdxComponents } from '@/lib/mdx-components';
import { SITE } from '@/lib/consts';
import {
  authorToSlug,
  getAllPosts,
  getAllSlugs,
  getPostBySlug,
  tagToSlug,
} from '@/lib/posts';
import { getAuthorByName } from '@/lib/authors';
import { articleAndReviewSchema, faqSchema } from '@/lib/schema';

/** 让 Next.js 构建时为每个 slug 生成静态 HTML */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/** 每篇文章独立的 metadata */
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Not found' };

  const url = `/blog/${post.slug}`;
  return {
    title: post.data.title,
    description: post.data.description,
    authors: [{ name: post.data.author }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.data.title,
      description: post.data.description,
      url,
      publishedTime: post.data.pubDate.toISOString(),
      modifiedTime: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
      authors: [post.data.author],
      tags: post.data.tags,
      images: [post.data.heroImage ?? SITE.defaultOgImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.data.title,
      description: post.data.description,
      images: [post.data.heroImage ?? SITE.defaultOgImage],
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  // 相关文章：同 category，排自己，最多 3 条
  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug && p.data.category === post.data.category)
    .slice(0, 3);

  // Schema.org：Article（必发）+ Review（仅评测文章）+ FAQPage（有 FAQ 才发）
  const schemas = articleAndReviewSchema(post);
  if (post.data.faq && post.data.faq.length > 0) {
    schemas.push(faqSchema(post.data.faq));
  }

  return (
    <article className="mx-auto max-w-3xl">
      {/* JSON-LD：多个 schema 各发一段 <script>，比 @graph 数组兼容性更好 */}
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <Breadcrumbs
        items={[
          { label: 'Blog', href: '/blog' },
          { label: post.data.category, href: `/blog?category=${post.data.category}` },
          { label: post.data.title },
        ]}
      />

      {/* Hero / 元信息 */}
      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-brand-600">
          <Link
            href={`/blog?category=${post.data.category}`}
            className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold hover:bg-brand-100"
          >
            {post.data.category}
          </Link>
          <span aria-hidden>·</span>
          <FormattedDate date={post.data.pubDate} />
          {post.data.updatedDate && (
            <>
              <span aria-hidden>·</span>
              <span>
                Updated <FormattedDate date={post.data.updatedDate} />
              </span>
            </>
          )}
          <span aria-hidden>·</span>
          <span className="normal-case tracking-normal text-ink-500">
            {post.readingTime}
          </span>
        </div>

        <h1 className="text-3xl font-bold leading-tight text-ink-900 sm:text-4xl">
          {post.data.title}
        </h1>
        <p className="mt-3 text-lg text-ink-700">{post.data.description}</p>

        <p className="mt-4 text-sm text-ink-500">
          By{' '}
          {getAuthorByName(post.data.author) ? (
            <Link
              href={`/authors/${authorToSlug(post.data.author)}`}
              className="font-medium text-brand-700 hover:underline"
            >
              {post.data.author}
            </Link>
          ) : (
            <span className="font-medium text-ink-700">{post.data.author}</span>
          )}
        </p>
      </header>

      {post.data.heroImage && (
        <figure className="mb-10 overflow-hidden rounded-xl border border-brand-100 bg-brand-50">
          {/*
            文章 hero 用 1200x675 (16:9) 作为默认 intrinsic 尺寸 ——
            实际渲染由 CSS 控制（max-w-3xl 容器 + h-auto w-full）。
            priority 让 LCP 元素提前加载，next/image 会自动写 fetchpriority=high。
          */}
          <Image
            src={post.data.heroImage}
            alt={post.data.heroImageAlt ?? post.data.title}
            width={1200}
            height={675}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full"
          />
          {post.data.heroImageAlt && (
            <figcaption className="px-4 py-2 text-xs text-ink-500">
              {post.data.heroImageAlt}
            </figcaption>
          )}
        </figure>
      )}

      {/* 正文：@tailwindcss/typography 自动美化输出 */}
      <div className="prose prose-lg max-w-none prose-headings:text-ink-900 prose-a:text-brand-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            // next-mdx-remote v6 默认 blockJS:true（安全加固），会把
            // <Foo prop={42} /> 里的 {42} 全部剥掉。我们的 mdx 内容是仓库
            // 内可信来源（不接受外部投稿），所以关掉这个限制，让 JSX
            // 表达式属性正常工作。blockDangerousJS 保留 true，仍然拦截
            // eval / Function / process 等真正的危险全局。
            blockJS: false,
            mdxOptions: {
              format: 'mdx',
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />
      </div>

      {/* FAQ 区块：有 faq 数组就渲染。<details> 实现"折叠展开"零 JS 依赖。
          注意：与上面 faqSchema() JSON-LD 字段必须保持一致，
          否则 Google 会标记为 "structured data mismatch"。 */}
      {post.data.faq && post.data.faq.length > 0 && (
        <section className="mt-12 border-t border-brand-100 pt-8">
          <h2 className="mb-4 text-xl font-bold text-ink-900">
            Frequently asked questions
          </h2>
          <div className="space-y-2">
            {post.data.faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-lg border border-brand-100 bg-white px-4 py-3 open:bg-brand-50/30"
              >
                <summary className="cursor-pointer list-none font-semibold text-ink-900 marker:hidden">
                  <span className="mr-2 inline-block transition-transform group-open:rotate-90">
                    ›
                  </span>
                  {item.q}
                </summary>
                <p className="mt-2 pl-5 text-sm text-ink-700">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* 标签 */}
      {post.data.tags.length > 0 && (
        <footer className="mt-12 border-t border-brand-100 pt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-500">
            Tags
          </h2>
          <ul className="flex flex-wrap gap-2">
            {post.data.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/blog/tag/${tagToSlug(tag)}`}
                  className="rounded-full border border-brand-200 px-3 py-1 text-xs text-brand-700 hover:bg-brand-50"
                >
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      )}

      {/* 相关文章 */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-brand-100 pt-10">
          <h2 className="mb-6 text-xl font-bold text-ink-900">
            More from {post.data.category}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
