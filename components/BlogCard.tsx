/**
 * <BlogCard />
 * 用在 /blog 列表页 + 首页 "Latest articles" 区块。
 */
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
    <article className="group flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {post.data.heroImage && (
        <Link href={href} className="block aspect-[16/9] overflow-hidden bg-brand-50">
          {/* 用原生 img 是为了支持外部任意 URL；如果你只用 next/image，可换成 <Image /> */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.data.heroImage}
            alt={post.data.heroImageAlt ?? title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-brand-600">
          <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold">
            {category}
          </span>
          <FormattedDate date={pubDate} />
          <span aria-hidden="true">·</span>
          <span className="normal-case tracking-normal text-ink-500">
            {post.readingTime}
          </span>
        </div>

        <h3 className="text-lg font-semibold leading-snug text-ink-900">
          <Link href={href} className="hover:text-brand-700">
            {title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-sm text-ink-700">{description}</p>

        <div className="mt-auto pt-3 text-sm font-medium text-brand-600">
          <Link href={href} className="hover:underline">
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
