/**
 * <Header /> 顶部导航
 * - 桌面端横向排列，移动端折叠（用原生 <details>，零额外 JS）
 * - 当前路径高亮，aria-current="page" 保证键盘/屏幕阅读器可达
 *
 * 这是 client component，因为我们用 usePathname() 来判断高亮态。
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE, NAV_LINKS } from '@/lib/consts';

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // 拆掉 query string，只比较 pathname
    const clean = href.split('?')[0];
    if (clean === '/') return pathname === '/';
    return pathname === clean || pathname.startsWith(`${clean}/`);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-sand-200 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        {/* Logo / 站点名 —— 极简水波标记（呼应"水上钓鱼"）+ 衬线字标，
            取代原来的 🛶 emoji，去掉廉价的 AI 感。 */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-ink-900 transition-colors hover:text-brand-700"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 text-brand-600 transition-colors group-hover:text-accent-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          >
            <path d="M2 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
            <path d="M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
          </svg>
          <span className="font-display text-xl font-semibold tracking-tight">
            {SITE.name}
          </span>
        </Link>

        {/* 桌面端导航 */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={
                      active
                        ? 'text-brand-700 underline decoration-accent-500 decoration-2 underline-offset-[6px]'
                        : 'text-ink-600 transition-colors hover:text-brand-700'
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 移动端折叠菜单：用 <details> 避免引入 JS */}
        <details className="relative md:hidden">
          <summary
            className="cursor-pointer list-none rounded-md border border-sand-300 px-3 py-2 text-sm font-medium text-ink-700"
            aria-label="Toggle navigation"
          >
            Menu
          </summary>
          <ul className="absolute right-0 mt-2 w-48 rounded-lg border border-sand-200 bg-white p-2 shadow-lg">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={
                      'block rounded px-3 py-2 text-sm ' +
                      (active
                        ? 'bg-brand-50 font-medium text-brand-700'
                        : 'text-ink-700 hover:bg-sand-50 hover:text-brand-700')
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </details>
      </div>
    </header>
  );
}
