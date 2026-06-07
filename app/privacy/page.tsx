/**
 * /privacy — 隐私政策页
 * ----------------------------------------------------------
 * 内容存放在 content/legal/privacy.mdx，方便非技术同学直接改文案，
 * 同时享受和 blog 一样的 MDX 渲染管线（GFM 表格、自动 heading id 等）。
 *
 * 文档加载逻辑被抽到 lib/legal.ts，与 /terms 等其他法律页共享。
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FormattedDate } from '@/components/FormattedDate';
import { mdxComponents } from '@/lib/mdx-components';
import { SITE } from '@/lib/consts';
import { loadLegalDoc } from '@/lib/legal';

const SLUG = 'privacy';

export function generateMetadata(): Metadata {
  const doc = loadLegalDoc(SLUG);
  if (!doc) return { title: 'Privacy Policy' };
  const url = `/${SLUG}`;
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: doc.title,
      description: doc.description,
      url,
      images: [SITE.defaultOgImage],
    },
    twitter: {
      card: 'summary',
      title: doc.title,
      description: doc.description,
    },
    // 隐私政策应该被收录，方便用户从搜索引擎直接到达
    robots: { index: true, follow: true },
  };
}

export default function PrivacyPage() {
  const doc = loadLegalDoc(SLUG);
  if (!doc) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Breadcrumbs items={[{ label: 'Privacy' }]} />

      <header className="mb-8">
        <h1 className="text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">
          {doc.title}
        </h1>
        <p className="mt-3 text-lg text-ink-600">{doc.description}</p>
        <p className="mt-4 text-sm text-ink-500">
          Last updated <FormattedDate date={doc.updatedDate} />
        </p>
      </header>

      {/* 复用 blog 详情页相同的 prose 样式，确保排版一致 */}
      <div className="prose prose-lg max-w-none prose-headings:text-ink-900 prose-a:text-brand-700 prose-a:no-underline hover:prose-a:underline">
        <MDXRemote
          source={doc.content}
          components={mdxComponents}
          options={{
            // 与 blog 详情页保持一致：仓库内可信来源，允许 JSX 表达式属性
            blockJS: false,
            mdxOptions: {
              format: 'mdx',
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />
      </div>
    </article>
  );
}
