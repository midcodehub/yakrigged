/**
 * 自动生成 /sitemap.xml
 * Next.js 约定：在 app/ 目录放一个 sitemap.ts，
 * 默认导出返回 MetadataRoute.Sitemap 即可。
 */
import type { MetadataRoute } from 'next';
import { getAllAuthors, getAllPosts, getAllTags } from '@/lib/posts';
import { getAuthorBySlug } from '@/lib/authors';
import { SITE } from '@/lib/consts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, '');

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/about`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/search`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const postUrls: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.data.updatedDate ?? post.data.pubDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const tagUrls: MetadataRoute.Sitemap = getAllTags().map((t) => ({
    url: `${base}/blog/tag/${t.slug}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  // 只为有 bio 档案的作者写入 sitemap（无档案的不存在路由）
  const authorUrls: MetadataRoute.Sitemap = getAllAuthors()
    .filter((a) => getAuthorBySlug(a.slug))
    .map((a) => ({
      url: `${base}/authors/${a.slug}`,
      changeFrequency: 'monthly',
      priority: 0.4,
    }));

  return [...staticUrls, ...postUrls, ...tagUrls, ...authorUrls];
}
