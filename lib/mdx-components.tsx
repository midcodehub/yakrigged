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
import { AffiliateLink } from '@/components/AffiliateLink';
import { YouTube } from '@/components/YouTube';
import { ProsCons } from '@/components/review/ProsCons';
import { SpecsTable } from '@/components/review/SpecsTable';
import { StarRating } from '@/components/review/StarRating';
import { VerdictBox } from '@/components/review/VerdictBox';
import { KeyTakeaway, ExpertQuote, StatBlock } from '@/components/geo';

/**
 * 已知"联盟链接短链"hostname 清单
 * --------------------------------------------
 * 这些域名整域都是营销转链，命中即视为联盟链接，无需再看参数。
 * 后续接入新的联盟渠道（如 ShareASale / Impact / CJ / Awin 等短链）
 * 时，在这里追加一行即可，所有 MDX 文章里写的 markdown 链接会自动
 * 注入 rel="sponsored nofollow"。
 */
const AFFILIATE_SHORTLINK_HOSTS = new Set<string>([
  'amzn.to',     // Amazon Associates 短链
  // 'geni.us',  // 多平台跳转短链（如有需要再开）
  // 'shrsl.com', // ShareASale 短链
]);

/**
 * Amazon 各国站点的长链域名
 * --------------------------------------------
 * Amazon 长链里只有携带 `?tag=xxx-20` 这种 Associates 标识参数时
 * 才算联盟链接；纯粹的商品页引用（无 tag）不应该被打成 sponsored
 * （否则会被 Google 视为过度 nofollow，反而拖累站内权重传递）。
 * 接入新的 Amazon 区域站点时在这里追加基础域名即可。
 */
const AMAZON_LONGLINK_DOMAINS = [
  'amazon.com',
  'amazon.co.uk',
  'amazon.ca',
  'amazon.de',
  'amazon.fr',
  'amazon.it',
  'amazon.es',
  'amazon.co.jp',
  'amazon.com.au',
];

/**
 * 判断给定 URL 是否为联盟链接
 *
 * 规则：
 *   1. hostname 命中 AFFILIATE_SHORTLINK_HOSTS（短链整域算）
 *   2. hostname 命中 AMAZON_LONGLINK_DOMAINS 且 query 含 `tag` 参数
 *
 * 注意 hostname 匹配采用 "精确等于 OR 以 .<域> 结尾"，避免被
 * notamazon.com 这类钓鱼域意外命中。
 */
function isAffiliateUrl(href: string): boolean {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }
  const host = url.hostname.toLowerCase();
  if (AFFILIATE_SHORTLINK_HOSTS.has(host)) return true;
  const isAmazonHost = AMAZON_LONGLINK_DOMAINS.some(
    (d) => host === d || host.endsWith(`.${d}`),
  );
  if (isAmazonHost && url.searchParams.has('tag')) return true;
  return false;
}

function MdxLink({
  href,
  ...rest
}: ComponentPropsWithoutRef<'a'>) {
  if (!href) return <a {...rest} />;
  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) {
    // 联盟链接：rel 必须包含 sponsored + nofollow
    // —— 这是 Amazon Associates 运营条款的硬性要求，同时 Google SEO
    // 也用这两个值区分付费链接，漏标可能影响佣金结算和搜索权重。
    const rel = isAffiliateUrl(href)
      ? 'nofollow sponsored noopener noreferrer'
      : 'noopener noreferrer';
    return (
      <a
        href={href}
        target="_blank"
        rel={rel}
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
  // <AffiliateLink asin="B07YPN7XYZ">名字</AffiliateLink> —— 用 ASIN 自动拼 affiliate 链接
  AffiliateLink,
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
