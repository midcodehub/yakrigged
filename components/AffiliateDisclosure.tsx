/**
 * <AffiliateDisclosure />
 * --------------------------------------------------
 * 任何包含联盟链接（Amazon Associates / 直接合作返佣）的文章都必须挂这个组件。
 *
 * 为什么这是合规必备：
 *   - FTC 16 CFR Part 255: 明示物质性联系（material connections）
 *   - Google Reviews Update（2023-）：要求第一屏附近披露
 *   - Amazon Operating Agreement §5: 要求"清楚 conspicuously"披露
 *
 * 用法：
 *   在 .mdx 文章正文开头写：
 *     <AffiliateDisclosure />
 *   也可传入变体：
 *     <AffiliateDisclosure variant="compact" />
 */

interface Props {
  /** "full" 默认两行块状；"compact" 适合 above-the-fold 用单行 */
  variant?: 'full' | 'compact';
  /** 自定义文案前缀（比如 sponsored post 用） */
  label?: string;
}

export function AffiliateDisclosure({
  variant = 'full',
  label = 'Disclosure',
}: Props) {
  if (variant === 'compact') {
    return (
      <p
        // 非装饰性元素：让屏幕阅读器读出 region 角色
        role="note"
        aria-label="Affiliate disclosure"
        className="my-6 text-xs text-ink-500"
      >
        <strong className="text-ink-700">{label}:</strong>{' '}
        Some links in this article earn YakRigged a small commission, at no
        extra cost to you.
      </p>
    );
  }

  return (
    <aside
      role="note"
      aria-label="Affiliate disclosure"
      className="my-8 rounded-lg border-l-4 border-accent-500 bg-accent-500/5 p-4 text-sm text-ink-700"
    >
      <p className="font-semibold text-ink-900">{label}</p>
      <p className="mt-1">
        Some product links in this article are affiliate links. If you buy
        through them, YakRigged may earn a small commission — at{' '}
        <strong>no extra cost to you</strong>. We bought every product
        ourselves; brands do not get to preview reviews before publication, and
        commissions do not affect our ratings.
      </p>
    </aside>
  );
}
