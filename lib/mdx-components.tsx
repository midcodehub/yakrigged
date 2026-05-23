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

export const mdxComponents = {
  a: MdxLink,
  // Image 组件：MDX 里写 <Image src="..." alt="..." /> 会用这个
  Image: MdxImage,
  // 在 MDX 里直接 <AffiliateDisclosure /> 就能用
  AffiliateDisclosure,
};
