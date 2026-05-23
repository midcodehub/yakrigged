/**
 * <VerdictBox /> —— 评测文章顶部的"一口气结论卡"
 * --------------------------------------------------
 * 现代 SEO 评测文章的标配：把"评分 / 适合谁 / 不适合谁 / 在哪买"
 * 全部塞到第一屏。原因：
 *   - Google 评测算法明确偏好"清晰、可扫描"的判断
 *   - 用户 70% 不会读完正文，把核心结论前置可以拉高停留 + 转化
 *
 * 用法（在 MDX 顶部）：
 *   <VerdictBox
 *     productName="Garmin Striker Vivid 5cv"
 *     rating={4.5}
 *     bestFor="Solo kayak anglers who fish all day"
 *     skipIf="You need side-imaging or networking"
 *     buyUrl="https://amzn.to/..."
 *     price="$329 (as of May 2026)"
 *   />
 */
import { StarRating } from './StarRating';

interface Props {
  productName: string;
  rating: number;
  bestFor: string;
  skipIf?: string;
  /** 联盟链接 / 厂家页 */
  buyUrl?: string;
  /** 显示价格字符串（包含币种/日期） */
  price?: string;
}

export function VerdictBox({
  productName,
  rating,
  bestFor,
  skipIf,
  buyUrl,
  price,
}: Props) {
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

        {(buyUrl || price) && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-200 pt-4">
            {price && (
              <span className="text-sm text-ink-700">
                <strong>Price:</strong> {price}
              </span>
            )}
            {buyUrl && (
              <a
                href={buyUrl}
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
