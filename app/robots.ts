/**
 * 自动生成 /robots.txt
 * Next.js 约定：app/robots.ts 默认导出 MetadataRoute.Robots。
 */
import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/consts';

export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, '');
  return {
    rules: [
      // 所有搜索引擎（含传统 + AI）
      { userAgent: '*', allow: '/' },
      // 明确欢迎 AI 爬虫——GEO 的前提是让它们抓到内容
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
