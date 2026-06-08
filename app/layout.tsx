/**
 * 根 layout —— 所有页面共享。
 * - 注入全局 CSS、Header、Footer
 * - 通过 metadata API 配置默认 SEO（页面级 metadata 会自动合并/覆盖这里）
 */
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE } from '@/lib/consts';
// 自托管字体（@fontsource）——不依赖 Google Fonts：GDPR 友好、更快、离线可构建。
// Inter = 正文/UI；Fraunces = 标题展示衬线（含斜体给 ExpertQuote pull-quote）。
// font-family 名：'Inter Variable' / 'Fraunces Variable'（见 app/globals.css 的 @theme）。
import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces/wght.css';
import '@fontsource-variable/fraunces/wght-italic.css';
import './globals.css';

export const metadata: Metadata = {
  // metadataBase 决定 og:image / canonical 等相对路径如何展开成绝对 URL
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author }],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale.replace('-', '_'),
    images: [SITE.defaultOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description,
    images: [SITE.defaultOgImage],
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: `${SITE.name} RSS` }],
      'text/plain': [{ url: '/llms.txt', title: `${SITE.name} LLM Context` }],
    },
  },
  icons: {
    icon: '/favicon.svg',
  },
  // 站长平台验证（值为空时 Next.js 会自动省略对应 meta 标签）
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: '#1f7065',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-paper font-sans text-ink-700 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-brand-700 focus:px-3 focus:py-1.5 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-10">
          {children}
        </main>
        <Footer />

        <Script defer src="https://cloud.umami.is/script.js" data-website-id="dda4a60a-5278-448b-94b3-7a99b34a7eaf" />

        {/*
          Vercel Analytics（PV/UV、来源、设备）+ Speed Insights（Core Web Vitals）
          - 都是 no-cookie / GDPR-friendly，不需要 consent banner
          - 仅在 Vercel 生产环境注入脚本；本地 dev 自动关闭，不会污染数据
          - 必须在 Vercel Dashboard → Analytics / Speed Insights tab 里点开关启用一次
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
