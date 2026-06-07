/**
 * <Header /> 顶部导航
 * - 桌面端横向排列，移动端折叠（用原生 <details>，零额外 JS）
 * - 当前路径高亮，aria-current="page" 保证键盘/屏幕阅读器可达
 *
 * 这是 client component：用 usePathname() + useSearchParams() 判断高亮态。
 *
 * 关键点：导航里 "Blog / Gear Reviews / How-To Guides" 三项 href 分别是
 *   /blog、/blog?category=reviews、/blog?category=guides
 * 它们 pathname 都是 /blog，靠 query 里的 category 区分。所以激活判断必须读
 * useSearchParams()。而 useSearchParams() 在静态页里必须包在 <Suspense> 内，
 * 否则整页会 deopt 成客户端渲染（伤 SSG/SEO）—— 见下方 Header() 里的包裹。
 */
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { SITE, NAV_LINKS } from '@/lib/consts';

/**
 * 计算"某个导航 href 是否为当前激活项"。
 * 需要同时看 pathname 和 query 里的 category，才能把指向同一个 /blog 的
 * 三个链接区分开（否则在 /blog 上三个会同时点亮 —— 之前的 bug）。
 */
function useIsActive(): (href: string) => boolean {
  const pathname = usePathname();
  const category = useSearchParams().get('category');

  return (href: string) => {
    const [path, query] = href.split('?');
    const hrefCategory = query
      ? new URLSearchParams(query).get('category')
      : null;

    if (path === '/') return pathname === '/';

    if (path === '/blog') {
      if (!pathname.startsWith('/blog')) return false;
      // 带 category 的链接（Gear Reviews / How-To Guides）：
      // 必须正好在 /blog 列表页且 category 完全匹配才激活。
      if (hrefCategory) return pathname === '/blog' && category === hrefCategory;
      // 不带 category 的 "Blog" 总览：仅当没有任何分类筛选时激活
      // （含文章详情页 /blog/<slug>，让它归属到 Blog）。
      return category === null;
    }

    // 其它链接（Search / Subscribe / About）：路径前缀匹配即可。
    return pathname === path || pathname.startsWith(`${path}/`);
  };
}

/**
 * 渲染导航项列表（桌面 / 移动共用同一份链接，只是样式不同）。
 * isActive 作为入参传入：实时版传真实判断函数，Suspense fallback 传 () => false
 * （首屏静态渲染时先不高亮，hydration 后由实时版接管）。
 */
function NavItems({
  isActive,
  mobile = false,
}: {
  isActive: (href: string) => boolean;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
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
    );
  }

  return (
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
  );
}

/** 实时导航（读 query 判断激活）—— 必须由 <Suspense> 包裹 */
function LiveNavItems({ mobile = false }: { mobile?: boolean }) {
  const isActive = useIsActive();
  return <NavItems isActive={isActive} mobile={mobile} />;
}

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-sand-200 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        {/* Logo / 站点名 —— 皮划艇徽章 mark（与 public/favicon.svg 完全一致：
            青底徽章 + 米色俯视艇身 + 橙桨）+ 衬线字标，构成正式的 logo lockup，
            取代原来含糊的水波线，并让 header 与浏览器页签 favicon 统一。 */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-ink-900 transition-colors hover:text-brand-700"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 64 64"
            className="h-7 w-7 shrink-0 transition-transform duration-300 group-hover:scale-105"
          >
            <rect width="64" height="64" rx="14" fill="#1a564b" />
            <path
              d="M32 12 C 40 20, 40 44, 32 52 C 24 44, 24 20, 32 12 Z"
              fill="#f7f4ee"
            />
            <ellipse cx="32" cy="32" rx="3" ry="5.2" fill="#1a564b" />
            <line
              x1="15"
              y1="41"
              x2="49"
              y2="23"
              stroke="#f4a45f"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-display text-xl font-semibold tracking-tight">
            {SITE.name}
          </span>
        </Link>

        {/* 桌面端导航 —— Suspense 包裹，fallback 先渲染不高亮的链接（SSG/无 JS 也能用）*/}
        <nav aria-label="Primary" className="hidden md:block">
          <Suspense fallback={<NavItems isActive={() => false} />}>
            <LiveNavItems />
          </Suspense>
        </nav>

        {/* 移动端折叠菜单：用 <details> 避免引入 JS */}
        <details className="relative md:hidden">
          <summary
            className="cursor-pointer list-none rounded-md border border-sand-300 px-3 py-2 text-sm font-medium text-ink-700"
            aria-label="Toggle navigation"
          >
            Menu
          </summary>
          <Suspense fallback={<NavItems isActive={() => false} mobile />}>
            <LiveNavItems mobile />
          </Suspense>
        </details>
      </div>
    </header>
  );
}
