/**
 * <Footer /> 页脚
 * - 版权 + 二级链接 + 简短价值主张
 * - 纯 server component（没有交互），尽可能保持静态
 */
import Link from 'next/link';
import { SITE, FOOTER_LINKS } from '@/lib/consts';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-brand-100 bg-brand-50/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-ink-700">
          <p className="font-semibold text-brand-700">{SITE.name}</p>
          <p>
            © {year} {SITE.name}. {SITE.tagline}.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-4 text-sm">
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
