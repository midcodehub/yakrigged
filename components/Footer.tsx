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
import { NewsletterForm } from './NewsletterForm';

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
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-4 sm:items-start">
        {/* Column 1 —— 品牌 + 版权 */}
        <div className="text-sm text-ink-700">
          <p className="text-base font-semibold text-brand-700">{SITE.name}</p>
          <p className="mt-1">© {year} {SITE.name}.</p>
          <p className="mt-1 text-ink-500">{SITE.tagline}.</p>
        </div>

        {/* Column 2 —— 内容分类（SEO 内链：每个页面都链到分类页） */}
        <nav aria-label="Content categories">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
            Content
          </p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link href="/blog?category=reviews" className="text-ink-700 hover:text-brand-700 hover:underline">
                Gear Reviews
              </Link>
            </li>
            <li>
              <Link href="/blog?category=guides" className="text-ink-700 hover:text-brand-700 hover:underline">
                How-To Guides
              </Link>
            </li>
            <li>
              <Link href="/blog?category=destinations" className="text-ink-700 hover:text-brand-700 hover:underline">
                Destinations
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-ink-700 hover:text-brand-700 hover:underline">
                All Articles
              </Link>
            </li>
          </ul>
        </nav>

        {/* Column 3 —— 订阅块 */}
        <div>
          <NewsletterForm
            source="footer"
            heading="One email, every Monday"
            subheading="New gear reviews & DIY rigs. No spam, no resold lists."
          />

          <Link
            href="/rss.xml"
            type="application/rss+xml"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-brand-700"
          >
            <RssIcon className="h-3 w-3 text-accent-500" />
            <span>or subscribe via RSS</span>
          </Link>
        </div>

        {/* Column 4 —— 二级导航 */}
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
