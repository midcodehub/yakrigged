/**
 * /terms — 服务条款页
 * ----------------------------------------------------------
 * 内容存放在 content/legal/terms.mdx，与 /privacy 共用 lib/legal.ts
 * 的加载逻辑和同一套 MDX 渲染配置。
 *
 * 路由 / 模板和 /privacy 几乎对称，只换 SLUG 与 Breadcrumbs 标签。
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

const SLUG = 'terms';

export function generateMetadata(): Metadata {
  const doc = loadLegalDoc(SLUG);
  if (!doc) return { title: 'Terms of Use' };
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
    // 条款页应被收录，方便用户直接从搜索引擎到达
    robots: { index: true, follow: true },
  };
}

export default function TermsPage() {
  const doc = loadLegalDoc(SLUG);
  if (!doc) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Breadcrumbs items={[{ label: 'Terms' }]} />

      <header className="mb-8">
        <h1 className="text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">
          {doc.title}
        </h1>
        <p className="mt-3 text-lg text-ink-600">{doc.description}</p>
        <p className="mt-4 text-sm text-ink-500">
          Last updated <FormattedDate date={doc.updatedDate} />
        </p>
      </header>

      <div className="prose prose-lg max-w-none prose-headings:text-ink-900 prose-a:text-brand-700 prose-a:no-underline hover:prose-a:underline">
        <MDXRemote
          source={doc.content}
          components={mdxComponents}
          options={{
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
