/**
 * <BlogCard />
 * 用在 /blog 列表页 + 首页 "Latest articles" 区块。
 */
import Image from 'next/image';
import Link from 'next/link';
import { FormattedDate } from './FormattedDate';
import type { Post } from '@/lib/posts';

interface Props {
  post: Post;
}

export function BlogCard({ post }: Props) {
  const { title, description, pubDate, category } = post.data;
  const href = `/blog/${post.slug}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-sand-200/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-sand-300">
      {post.data.heroImage && (
        <Link
          href={href}
          // relative 是 next/image fill 模式的硬性要求；
          // aspect-[16/10] 比 16:9 更"杂志开本"，保证容器有确定高度避免 CLS。
          className="relative block aspect-[16/10] overflow-hidden bg-sand-100"
        >
          <Image
            src={post.data.heroImage}
            alt={post.data.heroImageAlt ?? title}
            fill
            // 列表是 1 / 2 / 3 列响应式网格，最大列宽约 384px
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-center gap-2 text-[0.7rem] text-ink-500">
          <span className="font-semibold uppercase tracking-[0.14em] text-brand-700">
            {category}
          </span>
          <span aria-hidden="true" className="text-sand-300">·</span>
          <FormattedDate date={pubDate} />
          <span aria-hidden="true" className="text-sand-300">·</span>
          <span>{post.readingTime}</span>
        </div>

        <h3 className="font-display text-xl font-semibold leading-snug text-ink-900">
          <Link href={href} className="transition-colors group-hover:text-brand-700">
            {title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-ink-600">{description}</p>

        <div className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-medium text-brand-700">
          <Link href={href} className="inline-flex items-center gap-1.5">
            Read
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
