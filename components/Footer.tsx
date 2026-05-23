/**
 * <Footer /> 页脚
 * - 版权 + RSS 订阅块 + 二级导航
 * - 纯 server component（没有交互），尽可能保持静态
 *
 * 三列布局（桌面）：
 *   ┌─────────────┬────────────────────┬─────────────┐
 *   │ 品牌 + 版权 │ RSS 订阅入口       │ 二级导航     │
 *   └─────────────┴────────────────────┴─────────────┘
 * 移动端自动垂直堆叠。
 */
import Link from 'next/link';
import { SITE, FOOTER_LINKS } from '@/lib/consts';

/**
 * 标准 RSS 图标 SVG（圆点 + 两条弧线）。
 * inline 内联好处：
 *   - 不发额外请求
 *   - currentColor 让 Tailwind class 直接控制颜色
 *   - aria-hidden + 文字 label 满足无障碍
 */
function RssIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <circle cx="6.18" cy="17.82" r="2.18" />
      <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zM4 10.1v2.83c3.91 0 7.07 3.16 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-brand-100 bg-brand-50/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:items-start">
        {/* Column 1 —— 品牌 + 版权 */}
        <div className="text-sm text-ink-700">
          <p className="text-base font-semibold text-brand-700">{SITE.name}</p>
          <p className="mt-1">© {year} {SITE.name}.</p>
          <p className="mt-1 text-ink-500">{SITE.tagline}.</p>
        </div>

        {/* Column 2 —— RSS 订阅块（核心新增）
            为什么 RSS 还值得做：
            - 内容创作者圈子（独立博客订阅者）转化率比 Twitter 高 5–10×
            - Feedly / NetNewsWire / Reeder 用户对垂类博客忠诚度极高
            - 是非常便宜的"建立读者关系"通道，零运营成本 */}
        <div className="rounded-lg border border-brand-200 bg-white p-4 shadow-sm">
          <Link
            href="/rss.xml"
            className="group flex items-center gap-3 text-ink-900"
            // RSS feed 应该让浏览器和阅读器都可识别 —— 加 type 属性帮助某些阅读器
            type="application/rss+xml"
          >
            <span
              className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-accent-500 text-white transition-transform group-hover:scale-105"
              aria-hidden
            >
              <RssIcon className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold leading-tight group-hover:text-brand-700">
                Subscribe via RSS
              </span>
              <span className="block text-xs text-ink-500">
                New how-tos & gear reviews in your reader
              </span>
            </span>
          </Link>
          {/* 给硬核用户直接看到 feed URL，方便复制到阅读器 */}
          <p className="mt-3 break-all rounded bg-brand-50 px-2 py-1 font-mono text-[11px] text-ink-500">
            {SITE.url.replace(/\/$/, '')}/rss.xml
          </p>
        </div>

        {/* Column 3 —— 二级导航 */}
        <nav aria-label="Footer" className="sm:justify-self-end">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
            Explore
          </p>
          <ul className="flex flex-col gap-2 text-sm sm:items-end">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-700 hover:text-brand-700 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
