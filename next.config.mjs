/** @type {import('next').NextConfig} */
const nextConfig = {
  // 我们用 next-mdx-remote 在运行时渲染 content/blog 下的 .mdx，
  // 所以这里不需要 @next/mdx 的 pageExtensions 配置。
  reactStrictMode: true,

  // 默认就是 SSG/ISR 友好；Vercel 自动识别 Next.js 项目无需特殊设置。
  images: {
    /**
     * 允许的远程图片域名（next/image 只会优化这里列出的 host）。
     *
     * 已涵盖的常见来源：
     *  - images.unsplash.com / images.pexels.com —— 我们常用的版权安全 stock 图
     *  - **.amazonaws.com  —— Amazon S3 / CloudFront 默认子域
     *  - cdn.yakrigged.com —— 我们自己的 CDN（如果开了）
     *  - i.imgur.com       —— 临时草稿/演示常用
     *
     * 要新增 host：复制一行，把 hostname 改成目标域名即可。
     * 注意：开通配过的 host 会被 next/image 优化（生成 WebP/AVIF 多尺寸），
     *      没配的会在编译时报错 —— 这是安全特性，不要用通配符放行所有 host。
     */
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'cdn.yakrigged.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
    ],
    /**
     * AVIF 优先 + WebP 兜底（部分老浏览器不支持 AVIF）。
     * Next.js 默认就有这俩，这里显式声明是为了未来微调时一目了然。
     */
    formats: ['image/avif', 'image/webp'],

    /**
     * 允许 next/image 渲染 SVG。
     * --------------------------------------------------------------
     * 默认 next/image 出于安全考虑禁用 SVG（防止用户上传含脚本的 SVG）。
     * 我们的 hero 图（public/blog/*.svg）全部是仓库内自己手写、版本受控的
     * 可信资源，不接受外部上传，因此开启是安全的。
     * 同时附加严格 CSP：禁脚本 + sandbox，即使万一被注入也无法执行。
     */
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 让 RSS / sitemap 路由能拿到正确的站点 URL。
  // 部署到 Vercel 后，可通过 Vercel 环境变量 NEXT_PUBLIC_SITE_URL 覆盖。
};

export default nextConfig;
