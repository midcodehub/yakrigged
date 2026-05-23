/**
 * 法律页内容加载器（privacy / terms / 未来的 cookies / DMCA 等）
 * ----------------------------------------------------------
 * 为什么单独抽这一层：
 *   - 法律页结构高度相似（一个标题 + 一个更新日期 + 一段 MDX 正文），
 *     没必要每个路由都复制 fs.readFileSync + matter 那段；
 *   - 和 lib/posts.ts 分开是因为 blog 校验逻辑（必填 category/tags/author）
 *     不适合法律页，硬塞会污染数据模型；
 *   - 后续要加 /cookies、/dmca、/refund 之类只需在 content/legal 放新
 *     .mdx 文件，再加一个对应 app/<slug>/page.tsx 调用 loadLegalDoc() 即可。
 *
 * 性能提示：fs.readFileSync 看起来"同步"，但所有调用都发生在 RSC（服务器
 * 组件）里，构建时执行一次，运行时不会重复扫盘。
 */
import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/** 法律文档（来自 content/legal/<slug>.mdx） */
export interface LegalDoc {
  /** 文档 slug，与文件名一致（不带扩展名），如 "privacy" */
  slug: string;
  /** 页面 H1 + <title>，frontmatter.title */
  title: string;
  /** 页面 meta description / 副标题，frontmatter.description */
  description: string;
  /** 上次更新日期，frontmatter.updatedDate（缺失则回退为构建时刻） */
  updatedDate: Date;
  /** 去掉 frontmatter 后的 MDX 正文，交给 <MDXRemote> 渲染 */
  content: string;
}

/** content/legal 在仓库根目录下 */
const LEGAL_DIR = path.join(process.cwd(), 'content', 'legal');

/**
 * 按 slug 读取法律文档。文件不存在时返回 null，由路由层调用 notFound()。
 *
 * @example
 *   const doc = loadLegalDoc('privacy');
 *   if (!doc) notFound();
 */
export function loadLegalDoc(slug: string): LegalDoc | null {
  const fullPath = path.join(LEGAL_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: typeof data.title === 'string' ? data.title : slug,
    description:
      typeof data.description === 'string'
        ? data.description
        : '',
    // updatedDate 缺失时回退到当前日期，避免抛错让整站构建失败
    updatedDate: data.updatedDate
      ? new Date(data.updatedDate as string)
      : new Date(),
    content,
  };
}
