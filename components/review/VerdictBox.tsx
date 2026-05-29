/**
 * <VerdictBox /> —— 评测文章顶部的"一口气结论卡"
 * --------------------------------------------------
 * 现代 SEO 评测文章的标配：把"评分 / 适合谁 / 不适合谁 / 在哪买"
 * 全部塞到第一屏。原因：
 *   - Google 评测算法明确偏好"清晰、可扫描"的判断
 *   - 用户 70% 不会读完正文，把核心结论前置可以拉高停留 + 转化
 *
 * 用法（在 MDX 顶部）：
 * 买链有两种写法（二选一，asin 更推荐）：
 *   1. asin —— 传 Amazon ASIN，自动用全局 env tag 拼出联盟链接（无需手写 tag）：
 *        <VerdictBox ... asin="B0040ZME8U" />
 *   2. buyUrl —— 直接给完整 URL（厂家页 / 非 Amazon 渠道时用）：
 *        <VerdictBox ... buyUrl="https://werner.com/..." />
 *   两者都传时 buyUrl 优先（视为显式覆盖）。
 *
 *   <VerdictBox
 *     productName="Garmin Striker Vivid 5cv"
 *     rating={4.5}
 *     bestFor="Solo kayak anglers who fish all day"
 *     skipIf="You need side-imaging or networking"
 *     asin="B0XXXXXXXX"
 *     price="$329 (as of May 2026)"
 *   />
 */
import { StarRating } from './StarRating';
import { buildAmazonUrl, type AmazonRegion } from '@/lib/amazon';

interface Props {
  productName: string;
  rating: number;
  bestFor: string;
  skipIf?: string;
  /** 联盟链接 / 厂家页（完整 URL）。与 asin 二选一，传了则优先 */
  buyUrl?: string;
  /** Amazon ASIN —— 自动用全局 env tag 拼链，比手写 buyUrl 更省心 */
  asin?: string;
  /** Amazon 区域站点，配合 asin 用，默认 com */
  region?: AmazonRegion;
  /** 显示价格字符串（包含币种/日期） */
  price?: string;
}

export function VerdictBox({
  productName,
  rating,
  bestFor,
  skipIf,
  buyUrl,
  asin,
  region,
  price,
}: Props) {
  // buyUrl 显式覆盖；否则有 asin 就自动拼带 tag 的 Amazon 链接
  const href = buyUrl ?? (asin ? buildAmazonUrl(asin, region) : undefined);
  return (
    <aside
      role="complementary"
      aria-label="Editor's verdict"
      className="my-8 overflow-hidden rounded-xl border border-brand-200 bg-brand-50/50 shadow-sm"
    >
      <header className="border-b border-brand-200 bg-brand-100/60 px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
          Editor&apos;s verdict
        </p>
        <h3 className="!mt-0 text-lg font-bold text-ink-900">{productName}</h3>
      </header>

      <div className="space-y-4 p-5">
        <StarRating value={rating} />

        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Best for
            </dt>
            <dd className="!mt-1 text-sm text-ink-900">{bestFor}</dd>
          </div>
          {skipIf && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                Skip if
              </dt>
              <dd className="!mt-1 text-sm text-ink-900">{skipIf}</dd>
            </div>
          )}
        </dl>

        {(href || price) && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-200 pt-4">
            {price && (
              <span className="text-sm text-ink-700">
                <strong>Price:</strong> {price}
              </span>
            )}
            {href && (
              <a
                href={href}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-600"
              >
                Check current price →
              </a>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
