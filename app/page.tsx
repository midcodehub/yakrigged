/**
 * 首页 (/)
 * -----------------------------
 * 结构：
 *  1. Hero（价值主张 + 两个 CTA）
 *  2. "Why YakRigged" 三栏（E-E-A-T 信号）
 *  3. Latest Articles：最新 6 篇
 *  4. CTA banner：引导订阅 RSS
 *
 * 这是 RSC，所有 getAllPosts() 在构建时跑一次。
 */
import Link from 'next/link';
import { BlogCard } from '@/components/BlogCard';
import { getAllPosts } from '@/lib/posts';
import { SITE } from '@/lib/consts';
import { organizationSchema, websiteSearchSchema } from '@/lib/schema';

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 6);

  return (
    <>
      {/* 站点级 Schema.org —— Organization + WebSite/SearchAction
          注入到首页（最权威页面），让 Google Knowledge Graph 抓得到。 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSearchSchema()),
        }}
      />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-6 py-16 text-white shadow-lg sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl"
        />

        <div className="relative max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">
            Kayak Anglers · Independent Reviews
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Get rigged. Get on the water. Catch more fish.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-50">
            {SITE.tagline}. We test rod holders, fish finders, PFDs and paddles
            ourselves — so you can spend less time researching and more time
            catching.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="rounded-full bg-accent-500 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-accent-600"
            >
              Read the latest reviews →
            </Link>
            <Link
              href="/blog?category=guides"
              className="rounded-full border border-white/40 px-5 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse how-to guides
            </Link>
          </div>

          {/* 新手入门 pillar 的 root 级内链：给 pillar 一条来自首页（最高权重页）
              的链接，补齐 首页 → pillar → clusters 的权重传递链。
              做成轻量文字链而非第三个按钮，避免和上面两个主 CTA 抢视觉。 */}
          <p className="mt-5 text-sm text-brand-100">
            New to the sport?{' '}
            <Link
              href="/blog/kayak-fishing-for-beginners"
              className="font-semibold text-white underline underline-offset-4 hover:text-accent-500"
            >
              Start with our kayak fishing for beginners guide →
            </Link>
          </p>
        </div>
      </section>

      {/* ===== Start Here / Hub callout =====
          为什么放在 Hero 下面、Value Props 上面：
          - 用户刚看完 hero 就遇到"这里有完整指南"，转化路径最短
          - 给 hub page 一个来自 root（最高权重页面）的内链
          - SEO 角度：root → hub → 7 spoke 是经典的权重传递链
          视觉上故意区别于 BlogCard —— 这是 navigation 资产，不是文章列表项。 */}
      <section
        aria-labelledby="start-here-heading"
        className="mt-16 overflow-hidden rounded-2xl border border-accent-500/30 bg-gradient-to-br from-brand-50 via-white to-accent-500/5 p-8 shadow-sm sm:p-10"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent-600">
              <span aria-hidden>📌</span>
              <span>Start here</span>
            </p>
            <h2
              id="start-here-heading"
              className="text-2xl font-bold leading-tight text-ink-900 sm:text-3xl"
            >
              <Link
                href="/blog/kayak-fish-finder-setup-complete-guide"
                className="hover:text-brand-700 hover:underline"
              >
                Kayak Fish Finder Setup: The Complete Guide
              </Link>
            </h2>
            <p className="mt-3 text-ink-700">
              From bare kayak to fully-rigged electronics in one weekend.
              Every step has a deep-dive linked — head unit, transducer
              mount, battery sizing, waterproof box, cable routing, and
              defeating midday glare.
            </p>

            {/* 7 步骤 chip 行——让用户在卡片内就感受到"这是个完整流程"，
                不需要点击就能预览结构。每个 chip 不单独可点，统一引导到 hub。 */}
            <ol className="mt-5 flex flex-wrap gap-2 text-sm">
              {[
                'Head unit',
                'Transducer mount',
                'Battery',
                'Waterproof box',
                'Wiring',
                'Screen & glare',
              ].map((step, i) => (
                <li
                  key={step}
                  className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-ink-700"
                >
                  <span className="text-xs font-semibold text-accent-600">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex-none">
            <Link
              href="/blog/kayak-fish-finder-setup-complete-guide"
              className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
            >
              Read the complete guide
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Value props (E-E-A-T) ===== */}
      <section className="mt-16">
        <h2 className="text-center text-2xl font-bold text-ink-900">
          Why anglers read YakRigged
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-brand-100 p-6">
            <p className="text-3xl">🎣</p>
            <h3 className="mt-2 font-semibold text-ink-900">Real water testing</h3>
            <p className="mt-1 text-sm text-ink-700">
              Every product we review gets at least 10 hours on the water — no
              desk-only roundups.
            </p>
          </div>
          <div className="rounded-xl border border-brand-100 p-6">
            <p className="text-3xl">📏</p>
            <h3 className="mt-2 font-semibold text-ink-900">Specs you actually need</h3>
            <p className="mt-1 text-sm text-ink-700">
              Beam, weight capacity, hatch dimensions, real battery life —
              measured, not copy-pasted from the brand page.
            </p>
          </div>
          <div className="rounded-xl border border-brand-100 p-6">
            <p className="text-3xl">💰</p>
            <h3 className="mt-2 font-semibold text-ink-900">Independent, ad-light</h3>
            <p className="mt-1 text-sm text-ink-700">
              We disclose every affiliate link. Brands don&apos;t get to preview
              reviews before publication.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Latest articles ===== */}
      <section className="mt-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-ink-900">Latest articles</h2>
          <Link
            href="/blog"
            className="text-sm font-semibold text-brand-700 hover:underline"
          >
            View all →
          </Link>
        </div>

        {latestPosts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-brand-200 p-8 text-center text-ink-500">
            No articles yet. Check back soon — first reviews land this week.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* ===== CTA banner —— Newsletter 主，RSS 副 =====
          为什么这里不内联表单：深色背景上 input 配色复杂；
          点击跳 /subscribe 也方便统一管理订阅页样式。 */}
      <section className="mt-20 rounded-2xl bg-ink-900 px-6 py-10 text-center text-white sm:px-12">
        <h2 className="text-2xl font-bold">New gear review every week.</h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-500/90">
          Get the next one in your inbox — one email Monday morning, no
          spam, unsubscribe anytime.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/subscribe"
            className="rounded-full bg-accent-500 px-5 py-3 font-semibold text-white hover:bg-accent-600"
          >
            Join the newsletter →
          </Link>
          <Link
            href="/rss.xml"
            className="rounded-full border border-white/30 px-5 py-3 font-semibold text-white/90 hover:bg-white/10"
          >
            or grab the RSS feed
          </Link>
        </div>
      </section>
    </>
  );
}
