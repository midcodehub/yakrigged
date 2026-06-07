/**
 * /subscribe —— Newsletter 独立着陆页
 * --------------------------------------------------
 * 为什么需要这个：
 *  1. 社交分享 URL：发推 / 在群里说"订阅 yakrigged.com/subscribe"比 footer 的位置更好引导
 *  2. 给 sitemap 加一个 URL，被 Google 单独收录后可吃 "subscribe to YakRigged" 这类品牌词
 *  3. 给 footer / article-end 的表单一个"扩展状态"——用户犹豫时可以点 "Learn more" 到这里看完整介绍
 */
import type { Metadata } from 'next';
import { NewsletterForm } from '@/components/NewsletterForm';
import { SITE } from '@/lib/consts';

export const metadata: Metadata = {
  title: 'Subscribe',
  description: `Get new ${SITE.name} gear reviews, DIY rigs, and how-to guides delivered weekly. Field-tested by anglers, no marketing fluff.`,
  alternates: { canonical: '/subscribe' },
  openGraph: {
    title: `Subscribe to ${SITE.name}`,
    description: 'Weekly kayak fishing gear reviews & rigs in your inbox.',
    url: '/subscribe',
  },
};

export default function SubscribePage() {
  return (
    <section className="mx-auto max-w-2xl">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          Newsletter
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-ink-900 sm:text-5xl">
          Get rigged — in your inbox.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-600">
          One email every Monday. No fluff, no resold lists. Hit reply
          anytime — every email reaches a real human.
        </p>
      </header>

      <NewsletterForm
        source="subscribe-page"
        layout="hero"
        heading="Join the weekly newsletter"
        subheading="Powered by Beehiiv. Unsubscribe with one click — your address is never sold."
      />

      <section className="mt-12 grid gap-6 sm:grid-cols-3">
        <div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 13c2.2-2.4 4.4-2.4 6.6 0s4.4 2.4 6.6 0 4.4-2.4 5.8-1" />
              <path d="M3 18c2.2-2.4 4.4-2.4 6.6 0s4.4 2.4 6.6 0 4.4-2.4 5.8-1" />
            </svg>
          </span>
          <h2 className="mt-3 font-semibold text-ink-900">Real-water reviews</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">
            10+ hours on the water before any product makes it into the
            inbox.
          </p>
        </div>
        <div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.9 6.9a2.12 2.12 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </span>
          <h2 className="mt-3 font-semibold text-ink-900">DIY rigs that work</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">
            Step-by-step install guides — no &ldquo;consult a professional&rdquo;
            cop-outs.
          </p>
        </div>
        <div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </span>
          <h2 className="mt-3 font-semibold text-ink-900">Weekly, never more</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">
            One email a week, Mondays. If you stop reading, we&apos;ll
            see it in the open rate and back off.
          </p>
        </div>
      </section>

      <p className="mt-12 text-center text-xs text-ink-500">
        Already on RSS? You can keep both — they ship the same content.
        Prefer one? <a href="/rss.xml" className="text-brand-700 hover:underline">Grab the RSS feed →</a>
      </p>
    </section>
  );
}
