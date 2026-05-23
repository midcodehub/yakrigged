/**
 * 自动生成 /robots.txt
 * Next.js 约定：app/robots.ts 默认导出 MetadataRoute.Robots。
 */
import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/consts';

export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, '');
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${base}/sitemap.xml`,
  };
}
