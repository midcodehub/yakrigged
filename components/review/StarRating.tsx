/**
 * <StarRating value={4.5} />
 * --------------------------------------------------
 * 视觉星级。注意：
 *  - 仅用作"展示"，不参与 Schema.org JSON-LD（那块在 page 层直接发 Review schema 走 frontmatter）
 *  - 支持半星：实现思路是叠两层（灰色底 5 颗 + 金色覆盖层用 width 百分比）
 *  - aria-label 给屏幕阅读器读出 "4.5 out of 5"
 */
interface Props {
  /** 1–5 之间的浮点 */
  value: number;
  /** 最大值，默认 5 */
  max?: number;
  /** 后缀文本，比如 "(based on 40 hrs testing)" */
  caption?: string;
  /** 'lg' = 文章顶部展示用大字号，'sm' = 在表格里用 */
  size?: 'sm' | 'lg';
}

export function StarRating({ value, max = 5, caption, size = 'lg' }: Props) {
  const clamped = Math.max(0, Math.min(value, max));
  const pct = (clamped / max) * 100;
  const starSize = size === 'lg' ? 28 : 16;
  const stars = '★★★★★'.slice(0, max);

  return (
    <div
      role="img"
      aria-label={`${clamped} out of ${max} stars`}
      className="my-2 inline-flex items-center gap-3"
    >
      {/* 双层叠加实现任意小数星级 */}
      <div
        className="relative inline-block leading-none"
        style={{ fontSize: starSize, letterSpacing: 2 }}
      >
        <span className="text-brand-100">{stars}</span>
        <span
          className="absolute left-0 top-0 overflow-hidden text-accent-500"
          style={{ width: `${pct}%` }}
        >
          {stars}
        </span>
      </div>

      <span
        className={
          size === 'lg'
            ? 'text-lg font-semibold text-ink-900'
            : 'text-sm font-semibold text-ink-700'
        }
      >
        {clamped.toFixed(1)} / {max}
      </span>

      {caption && (
        <span className="text-sm text-ink-500">{caption}</span>
      )}
    </div>
  );
}
