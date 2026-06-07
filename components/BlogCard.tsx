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
      {post.data.heroImage ? (
        <Link
          href={href}
          // relative 是 next/image fill 模式的硬性要求；
          // aspect-[16/9] 必须与 hero SVG 的 1200×675(=16:9) 一致 —— 否则 object-cover
          // 会左右裁切，把 SVG 里按 16:9 排好的文字内边距吃掉，导致文字贴边。
          className="relative block aspect-[16/9] overflow-hidden bg-sand-100"
        >
          <Image
            src={post.data.heroImage}
            alt={post.data.heroImageAlt ?? title}
            fill
            // 列表是 1 / 2 / 3 列响应式网格，最大列宽约 384px
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
          />
        </Link>
      ) : (
        /* 无 hero 图的文章：渲染品牌占位 hero（青底渐变 + 等深线 + 衬线标题 +
           徽章水印），与模板 SVG hero 同一套视觉语言，保证 grid 卡片高度统一、
           不再出现"有些有图有些没图"的参差。 */
        <Link
          href={href}
          className="relative flex aspect-[16/9] flex-col justify-center overflow-hidden bg-gradient-to-br from-brand-900 to-brand-700 px-5"
        >
          <svg
            aria-hidden
            viewBox="0 0 400 225"
            preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 h-full w-full text-brand-300 opacity-[0.13]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M-20 70 C 80 50 140 95 220 70 S 360 40 420 78" />
            <path d="M-20 120 C 90 100 150 145 230 118 S 360 90 420 128" />
            <path d="M-20 170 C 80 150 150 195 230 168 S 360 140 420 178" />
          </svg>
          <svg
            aria-hidden
            viewBox="0 0 64 64"
            className="pointer-events-none absolute -bottom-3 -right-2 h-24 w-24 opacity-[0.09]"
          >
            <path d="M32 12 C 40 20, 40 44, 32 52 C 24 44, 24 20, 32 12 Z" fill="#f7f4ee" />
            <line x1="15" y1="41" x2="49" y2="23" stroke="#f7f4ee" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-brand-200">
              YakRigged · {category}
            </p>
            <p className="mt-1.5 line-clamp-3 font-display text-lg font-semibold leading-tight text-white">
              {title}
            </p>
          </div>
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
