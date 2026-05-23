/**
 * MDX 自定义渲染器
 * --------------------------------------------
 * next-mdx-remote 渲染 MDX 时，会把 markdown 转成对应的 JSX 标签。
 * 我们在这里覆盖部分标签（如 <a>、<img>、<h2>）以接入 Next.js 的内置组件
 * 与 Tailwind 类，确保 SEO 和无障碍体验一致。
 *
 * 用法：
 *   import { mdxComponents } from '@/lib/mdx-components';
 *   <MDXRemote source={...} components={mdxComponents} />
 */
import Image, { type ImageProps } from 'next/image';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';
import { YouTube } from '@/components/YouTube';
import { ProsCons } from '@/components/review/ProsCons';
import { SpecsTable } from '@/components/review/SpecsTable';
import { StarRating } from '@/components/review/StarRating';
import { VerdictBox } from '@/components/review/VerdictBox';
import { KeyTakeaway, ExpertQuote, StatBlock } from '@/components/geo';

function MdxLink({
  href,
  ...rest
}: ComponentPropsWithoutRef<'a'>) {
  if (!href) return <a {...rest} />;
  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      />
    );
  }
  // 站内链接：用 next/link 走客户端导航
  return <Link href={href} {...rest} />;
}

function MdxImage({ alt, width, height, ...rest }: ImageProps) {
  // 在 prose 容器内自动充满宽度并保持比例。
  // alt 显式解构，让 jsx-a11y/alt-text 能静态识别。
  return (
    <Image
      {...rest}
      alt={alt ?? ''}
      width={width ?? 1200}
      height={height ?? 630}
      className="rounded-lg"
    />
  );
}

/**
 * MDX 里 markdown 语法 ![alt](src) 会编译成 <img>。
 * 我们 override 一下，强制注入 loading="lazy" + decoding="async"。
 *
 * 为什么不直接换成 next/image：markdown 语法没法表达 width/height，
 * 而 next/image 必须有显式尺寸（或 fill+容器）才能用。所以这里仅做
 * "保底懒加载" —— 想要全套 next/image 优化的作者改用 <Image /> JSX 即可。
 */
function MdxMarkdownImg({
  alt,
  ...rest
}: ComponentPropsWithoutRef<'img'>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      alt={alt ?? ''}
      loading="lazy"
      decoding="async"
      className="rounded-lg"
    />
  );
}

export const mdxComponents = {
  a: MdxLink,
  // markdown ![alt](src) 走这里，自动 lazy load
  img: MdxMarkdownImg,
  // MDX 里写 <Image src="..." alt="..." /> 走 next/image 全套优化
  Image: MdxImage,
  // 在 MDX 里直接 <AffiliateDisclosure /> 就能用
  AffiliateDisclosure,
  // YouTube 视频嵌入：<YouTube id="..." title="..." caption="..." />
  YouTube,
  // 评测内容专用组件
  ProsCons,
  SpecsTable,
  StarRating,
  VerdictBox,
  // GEO 组件：帮助 AI 搜索引擎提取和引用内容
  KeyTakeaway,
  ExpertQuote,
  StatBlock,
};
