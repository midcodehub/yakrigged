/**
 * 博客文章数据层
 * --------------------------------------------
 * 职责：
 *   1. 读取 content/blog 下所有 .mdx 文件
 *   2. 用 gray-matter 解析 frontmatter
 *   3. 校验字段、过滤草稿、统一计算 reading time
 *   4. 提供 getAllPosts() / getPostBySlug() / getCategories() 给页面消费
 *
 * 之所以放在 lib/ 而不是 app/，是因为这是“可复用的非路由模块”，
 * Next.js App Router 推荐这样组织。
 *
 * 性能提示：这些函数全部在 RSC（服务器组件）里调用，
 * 构建时执行一次，运行时不会重复扫盘。
 */
import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { CATEGORIES, type Category } from './consts';

/** content/blog 在仓库根目录下 */
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

/** 单篇文章解析后的形状（前端使用的是这个） */
export interface Post {
  slug: string;
  /** 原始 mdx 字符串（详情页用 next-mdx-remote 渲染） */
  content: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
    category: Category;
    tags: string[];
    author: string;
    heroImage?: string;
    heroImageAlt?: string;
    draft: boolean;
  };
  /** 自动算出的阅读时长（"5 min read"） */
  readingTime: string;
}

/** 把 frontmatter 的 raw object 校验/标准化成 Post['data'] */
function normalizeFrontmatter(
  raw: Record<string, unknown>,
  slug: string,
): Post['data'] {
  const title = raw.title;
  const description = raw.description;
  const pubDate = raw.pubDate;
  const category = raw.category;

  // 基础校验：缺一个就直接抛错，让 next build 阶段就暴露问题
  if (typeof title !== 'string') {
    throw new Error(`[${slug}] frontmatter.title 必填且必须为字符串`);
  }
  if (typeof description !== 'string') {
    throw new Error(`[${slug}] frontmatter.description 必填且必须为字符串`);
  }
  if (!pubDate) {
    throw new Error(`[${slug}] frontmatter.pubDate 必填`);
  }
  if (!CATEGORIES.includes(category as Category)) {
    throw new Error(
      `[${slug}] frontmatter.category 非法："${category}"，允许：${CATEGORIES.join(' | ')}`,
    );
  }

  return {
    title,
    description,
    pubDate: new Date(pubDate as string),
    updatedDate: raw.updatedDate ? new Date(raw.updatedDate as string) : undefined,
    category: category as Category,
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    author: typeof raw.author === 'string' ? raw.author : 'YakRigged Editorial',
    heroImage: typeof raw.heroImage === 'string' ? raw.heroImage : undefined,
    heroImageAlt:
      typeof raw.heroImageAlt === 'string' ? raw.heroImageAlt : undefined,
    draft: Boolean(raw.draft),
  };
}

/** 读单个 mdx 文件（不过滤草稿） */
function readPost(filename: string): Post {
  const slug = filename.replace(/\.mdx?$/, '');
  const fullPath = path.join(BLOG_DIR, filename);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  return {
    slug,
    content,
    data: normalizeFrontmatter(data, slug),
    readingTime: readingTime(content).text,
  };
}

/** 拿到所有已发布文章（按发布时间倒序，已过滤草稿） */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f));
  return files
    .map(readPost)
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** 根据 slug 拿单篇文章（找不到返回 null，由路由层 notFound()） */
export function getPostBySlug(slug: string): Post | null {
  try {
    // 同时支持 .mdx / .md
    const filename = ['mdx', 'md']
      .map((ext) => `${slug}.${ext}`)
      .find((f) => fs.existsSync(path.join(BLOG_DIR, f)));
    if (!filename) return null;
    const post = readPost(filename);
    if (post.data.draft) return null;
    return post;
  } catch {
    return null;
  }
}

/** 所有 slug 列表 —— 给 generateStaticParams 用 */
export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/** 给定分类拿文章；不传则返回全部 */
export function getPostsByCategory(category?: string | null): Post[] {
  const all = getAllPosts();
  if (!category) return all;
  return all.filter((p) => p.data.category === category);
}

/** 统计每个分类下的文章数（用于列表页 chip 角标） */
export function getCategoryCounts(): Record<Category, number> {
  const counts: Record<string, number> = {};
  for (const cat of CATEGORIES) counts[cat] = 0;
  for (const post of getAllPosts()) {
    counts[post.data.category] = (counts[post.data.category] ?? 0) + 1;
  }
  return counts as Record<Category, number>;
}

// ---------------------------------------------------------------
// 标签（tag）相关
// ---------------------------------------------------------------

/** 把标签字符串转成 URL 安全的 slug —— 这是 tag 页路由的 key */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // 非字母数字一律转 -
    .replace(/^-+|-+$/g, ''); // 去掉首尾 -
}

/** 全站去重后的标签列表，按文章数倒序（多 → 少） */
export function getAllTags(): Array<{ tag: string; slug: string; count: number }> {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, slug: tagToSlug(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** 根据 tag slug 找到原始 tag 字符串（用于显示原文形态，如 "fish-finder"） */
export function findTagBySlug(slug: string): string | null {
  const hit = getAllTags().find((t) => t.slug === slug);
  return hit?.tag ?? null;
}

/** 拿到某个 tag slug 下的所有文章 */
export function getPostsByTag(slug: string): Post[] {
  return getAllPosts().filter((p) =>
    p.data.tags.some((t) => tagToSlug(t) === slug),
  );
}

// ---------------------------------------------------------------
// 作者（author）相关
// ---------------------------------------------------------------

/** 作者名转 slug，与 tagToSlug 同算法但单独命名，未来可独立演化 */
export function authorToSlug(author: string): string {
  return author
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** 全站去重的作者列表（按文章数倒序） */
export function getAllAuthors(): Array<{
  name: string;
  slug: string;
  count: number;
}> {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    counts.set(post.data.author, (counts.get(post.data.author) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, slug: authorToSlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getPostsByAuthor(slug: string): Post[] {
  return getAllPosts().filter((p) => authorToSlug(p.data.author) === slug);
}
