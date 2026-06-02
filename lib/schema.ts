/**
 * Schema.org JSON-LD 生成器
 * --------------------------------------------------
 * 集中维护所有 JSON-LD 模板。每个函数返回一个纯对象，
 * 调用方负责 stringify 后塞进 <script type="application/ld+json">。
 *
 * 为什么集中：
 *   - schema.org 的字段细节经常需要微调（type/url/image 形状）
 *   - 集中后类型签名清晰，避免散落在 page 里重复写
 *   - 单元测试 / lint 时更好抓
 */
import type { Post, ReviewMeta, FAQItem, ProductItem } from './posts';
import { SITE } from './consts';
import { buildAmazonUrl } from './amazon';

const BASE = SITE.url.replace(/\/$/, '');

/** 所有 JSON-LD 都是结构化对象 —— 用最宽松的类型让调用方可以混着 push */
export type JsonLd = Record<string, unknown>;

function absUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${BASE}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

/**
 * Organization —— 给首页等"高层级"页面用
 * Google 在 Knowledge Panel 会优先消费这个
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: BASE,
    logo: absUrl('/favicon.svg'),
    description: SITE.description,
    sameAs: [
      // 添加社交媒体链接后在这里补充，帮助 Knowledge Graph 关联
    ],
  };
}

/**
 * WebSite + SearchAction —— 让 Google 在 SERP 显示站内搜索框（sitelinks search box）
 * 触发要求：站点已经有一定权威 + Google 自己决定，但不发等于零机会。
 */
export function websiteSearchSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: BASE,
    description: SITE.description,
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: BASE,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Article + Review 复合 schema
 * 评测文章既要用 Article 保证基础富媒体，
 * 又要用 Review（嵌套在 itemReviewed 里）触发星级 rich result。
 *
 * 增强：
 *  - speakable: 标记 headline + description 可被语音助手朗读（GEO 信号）
 *  - isPartOf: 关联到 WebSite，帮助 AI 理解站点结构
 */
export function articleAndReviewSchema(post: Post): JsonLd[] {
  const url = absUrl(`/blog/${post.slug}`);
  const image = post.data.heroImage
    ? absUrl(post.data.heroImage)
    : absUrl(SITE.defaultOgImage);

  const article: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.data.title,
    description: post.data.description,
    image: [image],
    datePublished: post.data.pubDate.toISOString(),
    dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    author: { '@type': 'Person', name: post.data.author },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: absUrl('/favicon.svg') },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.data.tags.join(', '),
    // Speakable: 告诉语音助手和 AI 哪些部分最适合朗读/引用
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['article h1', 'article > header p'],
    },
    // 关联到站点整体
    isPartOf: {
      '@type': 'WebSite',
      name: SITE.name,
      url: BASE,
    },
  };

  if (!post.data.review) return [article];

  // 评测文章额外发一个 Review 对象，被 Google "Review snippet" 富媒体卡片消费
  const review = buildReviewSchema(post.data.review, url, post.data.author);
  return [article, review];
}

function buildReviewSchema(meta: ReviewMeta, url: string, author: string) {
  const ratingMax = meta.ratingMax ?? 5;

  // itemReviewed 必须有 @type；对装备类用 Product 最贴切
  const itemReviewed = {
    '@type': 'Product' as const,
    name: meta.productName,
    image: meta.image ? absUrl(meta.image) : undefined,
    brand: meta.brand
      ? { '@type': 'Brand', name: meta.brand }
      : undefined,
    // 价格信息（如果填了）走 Offer 子对象
    offers: meta.price
      ? {
          '@type': 'Offer',
          price: meta.price.amount,
          priceCurrency: meta.price.currency,
          availability: 'https://schema.org/InStock',
          url,
        }
      : undefined,
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: meta.rating,
      bestRating: ratingMax,
      worstRating: 1,
    },
    author: { '@type': 'Person', name: author },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
    },
    url,
  };
}

/**
 * FAQPage —— 让 SERP 在文章下方折叠展开 FAQ
 * Google 2023 起对 FAQ 富媒体收紧（仅政府/官方/医疗等限定），
 * 但发出来不亏，且对 AI Overview / Bing 仍然有效。
 */
export function faqSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

/**
 * ItemList(of Product) —— "best of" roundup 文章用。
 * --------------------------------------------------
 * 把整篇榜单标成一个有序的 Product 列表，每个 Product 带 brand + offers(价格)。
 * 价值：
 *   - Google 更容易把页面理解为"产品对比/推荐"，提升富媒体资格
 *   - AI 搜索引擎（AI Overview/Perplexity）能直接提取"产品 + 价格 + 排名"
 *
 * 设计取舍：只发 offers(客观价格)，**不**给每个第三方产品塞自评 Review 星级
 * ——避免在多款第三方产品上滥用 review 标记（Google 可能判为操纵）。
 * 文章 winner 的星级仍由单品 review schema(articleAndReviewSchema)负责。
 */
export function productRoundupSchema(
  products: ProductItem[],
  pageUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: pageUrl,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => {
      const item: JsonLd = {
        '@type': 'Product',
        name: p.name,
      };
      if (p.brand) item.brand = { '@type': 'Brand', name: p.brand };
      if (p.asin) item.url = buildAmazonUrl(p.asin);
      if (p.price) {
        item.offers = {
          '@type': 'Offer',
          price: p.price.amount,
          priceCurrency: p.price.currency,
          availability: 'https://schema.org/InStock',
          ...(p.asin ? { url: buildAmazonUrl(p.asin) } : {}),
        };
      }
      return {
        '@type': 'ListItem',
        position: i + 1,
        item,
      };
    }),
  };
}

/**
 * ItemList —— 博客列表页用，帮助 Google 显示 carousel 富媒体
 * 也让 AI 搜索引擎理解"这是一组相关文章"
 */
export function itemListSchema(posts: { slug: string; data: { title: string } }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: post.data.title,
      url: absUrl(`/blog/${post.slug}`),
    })),
  };
}

/**
 * CollectionPage —— 标签/分类聚合页用
 * 帮助搜索引擎理解这是一个主题集合而非独立内容
 */
export function collectionPageSchema(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: absUrl(opts.url),
    isPartOf: {
      '@type': 'WebSite',
      name: SITE.name,
      url: BASE,
    },
  };
}
