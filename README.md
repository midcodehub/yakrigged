# YakRigged

> Kayak fishing gear reviews, how-to guides, and destination notes.
> Built with [Next.js 14 App Router](https://nextjs.org) + [Tailwind CSS v4](https://tailwindcss.com), deployed to [Vercel](https://vercel.com).

## 🚀 Quick start

```bash
# 1. 安装依赖
npm install

# 2. 本地开发（默认 http://localhost:3000）
npm run dev

# 3. 类型检查
npm run type-check

# 4. 生产构建
npm run build

# 5. 本地预览生产产物
npm run start
```

## 📁 项目结构

```text
app/                          # Next.js App Router
├── layout.tsx                # 根 layout（注入 Header/Footer + 默认 SEO）
├── page.tsx                  # Home /
├── globals.css               # Tailwind v4 入口 + design tokens
├── not-found.tsx             # 全局 404
├── about/page.tsx            # /about
├── blog/
│   ├── page.tsx              # /blog 列表 + 分类过滤
│   └── [slug]/page.tsx       # /blog/<slug> 单篇文章（MDX 渲染）
├── rss.xml/route.ts          # /rss.xml
├── sitemap.ts                # /sitemap.xml
└── robots.ts                 # /robots.txt
components/
├── Header.tsx                # 顶部导航（client component for active state）
├── Footer.tsx
├── BlogCard.tsx
└── FormattedDate.tsx
content/
└── blog/                     # ← 所有 .mdx 博客文章放这里
lib/
├── consts.ts                 # 站点常量（名字、导航、SEO 默认值）
├── posts.ts                  # MDX 文件加载 + frontmatter 解析
└── mdx-components.tsx        # MDX 自定义渲染（用 next/link、next/image）
public/
└── favicon.svg
next.config.mjs
postcss.config.mjs
tsconfig.json
package.json
```

## ✍️ 写一篇新文章

1. 在 `content/blog/` 下新建 `your-slug.mdx`
2. 顶部 frontmatter 必填字段：

   ```yaml
   ---
   title: "..."          # 必填
   description: "..."    # 必填，用于 meta description / OG
   pubDate: 2026-05-23   # 必填
   category: reviews     # 必填，枚举：reviews | guides | destinations | news
   tags: [paddle, budget]
   author: Your Name     # 可选，默认 "YakRigged Editorial"
   updatedDate: 2026-06-01
   heroImage: /images/xx.jpg
   heroImageAlt: "alt text"
   draft: false          # 设为 true 时该文章不会出现在列表/路由中
   ---
   ```

3. 路径 `/blog/your-slug` 会在 `next build` 时自动生成。

## 🚢 部署到 Vercel

1. 把仓库推到 GitHub / GitLab / Bitbucket
2. 在 Vercel Dashboard 点 **Add New → Project**，选这个仓库
3. Vercel 自动识别 Next.js，无需额外构建配置
4. 在 Vercel 项目的 **Environment Variables** 里设置：
   - `NEXT_PUBLIC_SITE_URL = https://your-domain.com`
5. 在 Vercel 项目里绑定自己的域名即可

> `lib/consts.ts` 里的 `SITE.url` 会优先读 `NEXT_PUBLIC_SITE_URL`，
> 这样 sitemap / RSS / OG 都会用你的正式域名而不是占位的 `www.yakrigged.com`。

## 📊 SEO 内置项

- ✅ `<title>` / `description` / canonical（Next.js Metadata API 自动注入）
- ✅ OpenGraph + Twitter Card
- ✅ Article schema.org JSON-LD（文章详情页）
- ✅ `/sitemap.xml`（从 `app/sitemap.ts` 自动生成）
- ✅ `/robots.txt`（从 `app/robots.ts` 自动生成）
- ✅ `/rss.xml`（自手写，含 atom:link self 引用）
- ✅ generateStaticParams 让所有文章默认 SSG
- ✅ Skip-to-content 无障碍链接、aria-current、`<time datetime>` 等语义化标签

## 🧰 技术栈

| 组件 | 选择 |
| --- | --- |
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript (strict) |
| 样式 | Tailwind CSS v4（PostCSS 插件方式） |
| MDX | `next-mdx-remote/rsc` + `gray-matter` |
| Markdown 扩展 | `remark-gfm`（表格/任务列表） + `rehype-slug`（标题锚点） |
| 字体 | Inter (rsms.me/inter) |
| 部署 | Vercel |
