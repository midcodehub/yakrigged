/**
 * RSS feed —— /rss.xml
 * --------------------------------------------
 * Next.js App Router 里，"route.ts" 文件就是一个 HTTP handler。
 * 我们手写一份 RFC 4287 的 RSS 2.0 XML，依赖最少，控制力最强。
 *
 * 字段说明都尽量贴合 Apple/Feedly 等主流阅读器的解析需求。
 */
import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import { SITE } from '@/lib/consts';

/** 对 XML 不安全字符做转义，避免文章标题里的 & 和 < 破坏整份 feed */
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const base = SITE.url.replace(/\/$/, '');
  const posts = getAllPosts();
  const updated = posts[0]?.data.pubDate ?? new Date();

  const items = posts
    .map((post) => {
      const url = `${base}/blog/${post.slug}`;
      const cats = [post.data.category, ...post.data.tags]
        .map((c) => `<category>${xmlEscape(c)}</category>`)
        .join('');
      return `
    <item>
      <title>${xmlEscape(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
      <description>${xmlEscape(post.data.description)}</description>
      <author>${xmlEscape(post.data.author)}</author>
      ${cats}
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE.name)}</title>
    <link>${base}</link>
    <description>${xmlEscape(SITE.description)}</description>
    <language>${SITE.locale}</language>
    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // 让 Vercel 边缘缓存 RSS 一小时，避免每次请求都扫盘
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
