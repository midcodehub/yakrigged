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
    <header className="sticky top-0 z-20 border-b border-brand-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo / 站点名 */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-brand-700 hover:text-brand-800"
        >
          <span aria-hidden="true" className="text-2xl">🛶</span>
          <span>{SITE.name}</span>
        </Link>

        {/* 桌面端导航 */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={
                      active
                        ? 'text-brand-700 underline underline-offset-4'
                        : 'text-ink-700 transition-colors hover:text-brand-600'
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
            className="cursor-pointer list-none rounded-md border border-brand-200 px-3 py-2 text-sm text-brand-700"
            aria-label="Toggle navigation"
          >
            Menu
          </summary>
          <ul className="absolute right-0 mt-2 w-48 rounded-md border border-brand-100 bg-white p-2 shadow-lg">
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
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink-700 hover:bg-brand-50 hover:text-brand-700')
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
