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

      {/* ===== Hero =====
          换掉原来的渐变 blob：深湖蓝场 + 低透明度"等深线"纹理（呼应钓鱼读的
          depth contour 地图，户外杂志感），衬线大标题挑大梁。photo-ready：
          将来想换满幅水面照，把这个 section 背景换成 next/image 即可。 */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-900 px-6 py-20 text-white shadow-lg sm:px-14 sm:py-28">
        {/* 等深线纹理背景 */}
        <svg
          aria-hidden
          viewBox="0 0 1200 520"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 h-full w-full text-brand-300 opacity-[0.14]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M-40 90 C 240 50 430 140 680 95 S 1080 40 1320 105" />
          <path d="M-40 150 C 250 115 440 200 690 155 S 1090 100 1320 165" />
          <path d="M-40 215 C 230 180 460 270 700 215 S 1100 165 1320 230" />
          <path d="M-40 285 C 250 250 450 335 690 285 S 1110 235 1320 300" />
          <path d="M-40 360 C 240 325 460 410 700 355 S 1100 305 1320 372" />
          <path d="M-40 435 C 250 400 450 485 690 432 S 1110 382 1320 448" />
        </svg>
        {/* 左下暖橙微光，给深色场一点温度 */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent-500/15 blur-3xl"
        />

        <div className="relative max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-brand-200">
            Field-tested · Independent reviews
          </p>
          <h1 className="font-display text-[2.6rem] font-semibold leading-[1.05] sm:text-6xl">
            Get rigged.
            <br />
            Get on the water.
            <br />
            <span className="text-accent-400">Catch more fish.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-50/90">
            {SITE.tagline}. We test rod holders, fish finders, PFDs and paddles
            ourselves — so you spend less time researching and more time
            catching.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="rounded-full bg-accent-500 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-accent-600"
            >
              Read the latest reviews →
            </Link>
            <Link
              href="/blog?category=guides"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white/90 transition-colors hover:bg-white/10"
            >
              Browse how-to guides
            </Link>
          </div>

          {/* 新手入门 pillar 的 root 级内链：给 pillar 一条来自首页（最高权重页）
              的链接，补齐 首页 → pillar → clusters 的权重传递链。
              做成轻量文字链而非第三个按钮，避免和上面两个主 CTA 抢视觉。 */}
          <p className="mt-6 text-sm text-brand-100/80">
            New to the sport?{' '}
            <Link
              href="/blog/kayak-fishing-for-beginners"
              className="font-semibold text-white underline decoration-accent-500/70 underline-offset-4 hover:decoration-accent-500"
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
        className="mt-14 overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-sand-200 sm:p-10"
      >
        {/* 左侧一道橙色竖条做"重点"标记，取代 📌 emoji */}
        <div className="border-l-2 border-accent-500 pl-5 sm:pl-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
                Start here
              </p>
              <h2
                id="start-here-heading"
                className="text-2xl font-semibold leading-tight text-ink-900 sm:text-3xl"
              >
                <Link
                  href="/blog/kayak-fish-finder-setup-complete-guide"
                  className="hover:text-brand-700"
                >
                  Kayak Fish Finder Setup: The Complete Guide
                </Link>
              </h2>
              <p className="mt-3 leading-relaxed text-ink-600">
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
                    className="flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1 text-ink-700"
                  >
                    <span className="font-semibold text-accent-600">
                      {String(i + 1).padStart(2, '0')}
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
        </div>
      </section>

      {/* ===== Value props (E-E-A-T) =====
          去掉 emoji 图标（AI 感重灾区），改细线 SVG 图标 + 顶部 hairline +
          衬线小标题的"杂志特性行"排版。 */}
      <section className="mt-20">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
          Why anglers read YakRigged
        </p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-sand-200 sm:grid-cols-3">
          {[
            {
              title: 'Real water testing',
              body: 'Every product we review gets at least 10 hours on the water — no desk-only roundups.',
              icon: (
                <>
                  <path d="M3 13c2.2-2.4 4.4-2.4 6.6 0s4.4 2.4 6.6 0 4.4-2.4 5.8-1" />
                  <path d="M3 18c2.2-2.4 4.4-2.4 6.6 0s4.4 2.4 6.6 0 4.4-2.4 5.8-1" />
                  <path d="M12 3v6M9.5 6.5 12 9l2.5-2.5" />
                </>
              ),
            },
            {
              title: 'Specs you actually need',
              body: 'Beam, weight capacity, hatch dimensions, real battery life — measured, not copy-pasted from the brand page.',
              icon: (
                <>
                  <rect x="3" y="7" width="18" height="10" rx="1.5" />
                  <path d="M7 7v3M11 7v4M15 7v3M19 7v4" />
                </>
              ),
            },
            {
              title: 'Independent, ad-light',
              body: "We disclose every affiliate link. Brands don't get to preview reviews before publication.",
              icon: (
                <>
                  <path d="M12 3 5 6v5c0 4.4 3 6.9 7 8 4-1.1 7-3.6 7-8V6z" />
                  <path d="m9 11.5 2 2 4-4" />
                </>
              ),
            },
          ].map((item) => (
            <div key={item.title} className="bg-white p-7">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {item.icon}
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Latest articles ===== */}
      <section className="mt-20">
        <div className="mb-7 flex items-end justify-between border-b border-sand-200 pb-4">
          <h2 className="text-2xl font-semibold text-ink-900 sm:text-3xl">
            Latest articles
          </h2>
          <Link
            href="/blog"
            className="shrink-0 text-sm font-medium text-brand-700 hover:text-accent-600"
          >
            View all →
          </Link>
        </div>

        {latestPosts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-sand-300 p-8 text-center text-ink-500">
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
          点击跳 /subscribe 也方便统一管理订阅页样式。
          深色场改用 brand-900 + 等深线纹理，与 hero 首尾呼应。 */}
      <section className="relative mt-20 overflow-hidden rounded-2xl bg-brand-900 px-6 py-12 text-center text-white sm:px-12">
        <svg
          aria-hidden
          viewBox="0 0 1200 240"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 h-full w-full text-brand-300 opacity-[0.12]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M-40 70 C 240 35 460 120 700 70 S 1100 25 1320 85" />
          <path d="M-40 140 C 250 105 450 190 690 140 S 1110 90 1320 155" />
        </svg>
        <div className="relative">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            New gear review every week.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100/80">
            Get the next one in your inbox — one email Monday morning, no spam,
            unsubscribe anytime.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/subscribe"
              className="rounded-full bg-accent-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-600"
            >
              Join the newsletter →
            </Link>
            <Link
              href="/rss.xml"
              className="rounded-full border border-white/25 px-6 py-3 font-semibold text-white/90 transition-colors hover:bg-white/10"
            >
              or grab the RSS feed
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
