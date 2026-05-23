/** @type {import('next').NextConfig} */
const nextConfig = {
  // 我们用 next-mdx-remote 在运行时渲染 content/blog 下的 .mdx，
  // 所以这里不需要 @next/mdx 的 pageExtensions 配置。
  reactStrictMode: true,

  // 默认就是 SSG/ISR 友好；Vercel 自动识别 Next.js 项目无需特殊设置。
  images: {
    // 文章里如果引用外部图片域名，加到这里即可。先放一个稳妥的默认。
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.yakrigged.com' },
    ],
  },

  // 让 RSS / sitemap 路由能拿到正确的站点 URL。
  // 部署到 Vercel 后，可通过 Vercel 环境变量 NEXT_PUBLIC_SITE_URL 覆盖。
};

export default nextConfig;
