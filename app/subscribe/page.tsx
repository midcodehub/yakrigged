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
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
          Newsletter
        </p>
        <h1 className="mt-1 text-3xl font-bold text-ink-900 sm:text-4xl">
          Get rigged — in your inbox.
        </h1>
        <p className="mt-3 text-ink-700">
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
          <p className="text-2xl" aria-hidden>🎣</p>
          <h2 className="mt-2 font-semibold text-ink-900">Real-water reviews</h2>
          <p className="mt-1 text-sm text-ink-700">
            10+ hours on the water before any product makes it into the
            inbox.
          </p>
        </div>
        <div>
          <p className="text-2xl" aria-hidden>🔧</p>
          <h2 className="mt-2 font-semibold text-ink-900">DIY rigs that work</h2>
          <p className="mt-1 text-sm text-ink-700">
            Step-by-step install guides — no &ldquo;consult a professional&rdquo;
            cop-outs.
          </p>
        </div>
        <div>
          <p className="text-2xl" aria-hidden>📬</p>
          <h2 className="mt-2 font-semibold text-ink-900">Weekly, never more</h2>
          <p className="mt-1 text-sm text-ink-700">
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
