#!/usr/bin/env node
/**
 * 构建时生成 public/search-index.json
 * --------------------------------------------------
 * 思路：扫 content/blog 所有 mdx，取 frontmatter + 正文，
 * 写出一份扁平 JSON 索引，给 /search 页客户端做模糊匹配。
 *
 * 为什么不用 Algolia / Pagefind：
 *   - 文章规模小（<1000），客户端纯 substring 已经够用，零运行时依赖
 *   - 不引第三方 → 不需要额外密钥/账号/CI 配置
 *   - JSON 体积线性增长，估算 1000 篇文章 ≈ 200KB，gzip 后更小，可接受
 *
 * 如果未来文章数突破阈值或要支持中文/俄文等切词，再换成 Pagefind/FlexSearch。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 由于这个脚本走 ESM，需要用 import() 动态加载 CommonJS 模块
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const blogDir = path.join(root, 'content', 'blog');
const outFile = path.join(root, 'public', 'search-index.json');

// gray-matter 是 CJS，直接 require 风格 import 即可
const matterModule = await import('gray-matter');
const matter = matterModule.default;

/** 极简的 MDX 正文清洗：去 frontmatter、去围栏代码块、去 markdown 语法字符 */
function stripMdx(content) {
  return content
    .replace(/```[\s\S]*?```/g, ' ') // 代码块
    .replace(/`[^`]*`/g, ' ') // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 图片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) → text
    .replace(/^---[\s\S]*?---/m, ' ') // 残留 frontmatter
    .replace(/[#>*_~`]/g, ' ') // markdown 标记字符
    .replace(/\s+/g, ' ') // 折叠空白
    .trim();
}

function build() {
  if (!fs.existsSync(blogDir)) {
    console.warn(`[search-index] content/blog 不存在，跳过`);
    fs.writeFileSync(outFile, '[]');
    return;
  }

  const files = fs
    .readdirSync(blogDir)
    .filter((f) => /\.mdx?$/.test(f));

  const records = [];
  for (const file of files) {
    const fullPath = path.join(blogDir, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);
    if (data.draft) continue;

    const slug = file.replace(/\.mdx?$/, '');
    // 正文截前 800 字符做索引体，足够 substring 匹配
    const body = stripMdx(content).slice(0, 800);

    records.push({
      slug,
      title: data.title,
      description: data.description,
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: data.author ?? 'YakRigged Editorial',
      pubDate:
        data.pubDate instanceof Date
          ? data.pubDate.toISOString()
          : new Date(data.pubDate).toISOString(),
      // 把所有可搜字段拼成一个 lowercase haystack，前端搜索一次匹配即可
      haystack: [
        data.title,
        data.description,
        data.category,
        ...(Array.isArray(data.tags) ? data.tags : []),
        data.author,
        body,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    });
  }

  // 写出前确保目录存在
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(records));

  console.log(
    `[search-index] 已写入 ${records.length} 条 → ${path.relative(root, outFile)} (${
      (fs.statSync(outFile).size / 1024).toFixed(1)
    } KB)`,
  );
}

build();
