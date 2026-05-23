/**
 * 站点级常量
 * --------------------------------------------
 * 所有“站点元信息 / 导航 / 默认 SEO 字段”都集中放在这里，
 * 后续要改文案、加导航条目、换 logo 都只改这一个文件。
 */

export const SITE = {
  /** 站点名（出现在 header、<title>、og:site_name） */
  name: 'YakRigged',
  /** Slogan / 副标题 */
  tagline: 'Kayak Fishing Gear, Reviewed by People Who Actually Paddle',
  /** 默认 meta description（首页 + 缺省 fallback） */
  description:
    'Independent kayak fishing gear reviews, rigging guides, and destination notes. We test rod holders, fish finders, PFDs, paddles and more on real water — so you can make better buying decisions.',
  /** 站点正式域名（部署到 Vercel 后请替换为自己的域名） */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yakrigged.com',
  /** 默认作者（SEO / RSS author 字段会用） */
  author: 'YakRigged Editorial',
  /** 默认语言 */
  locale: 'en-US',
  /** 默认 OG 分享图（放在 public/og-default.jpg） */
  defaultOgImage: '/og-default.jpg',
} as const;

export const NAV_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gear Reviews', href: '/blog?category=reviews' },
  { label: 'How-To Guides', href: '/blog?category=guides' },
  { label: 'Search', href: '/search' },
  { label: 'Subscribe', href: '/subscribe' },
  { label: 'About', href: '/about' },
];

export const FOOTER_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Subscribe', href: '/subscribe' },
  { label: 'RSS', href: '/rss.xml' },
  { label: 'Sitemap', href: '/sitemap.xml' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Contact', href: 'mailto:hello@yakrigged.com' },
];

/** Frontmatter 里 category 字段的合法值 */
export const CATEGORIES = ['reviews', 'guides', 'destinations', 'news'] as const;
export type Category = (typeof CATEGORIES)[number];
