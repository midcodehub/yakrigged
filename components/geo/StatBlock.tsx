/**
 * <StatBlock /> — Data/statistics block for GEO
 * --------------------------------------------------
 * Renders a highlighted statistic with source attribution.
 * Statistics with cited sources boost AI visibility by ~37-40%
 * (Princeton GEO study, KDD 2024).
 *
 * Usage in MDX:
 *   <StatBlock
 *     value="10+ hours"
 *     label="minimum on-water testing per review"
 *     source="YakRigged editorial policy"
 *   />
 *
 *   <StatBlock
 *     value="800 nits"
 *     label="Garmin Striker Vivid 5cv screen brightness"
 *     source="Measured with lux meter, May 2026"
 *   />
 */
interface Props {
  /** The statistic value (e.g., "4.5/5", "10+ hours", "$329") */
  value: string;
  /** What the stat measures */
  label: string;
  /** Source attribution */
  source?: string;
}

export function StatBlock({ value, label, source }: Props) {
  return (
    <div
      data-geo="statistic"
      className="my-5 inline-flex items-baseline gap-2.5 rounded-lg bg-sand-100 px-4 py-2.5"
    >
      <span className="font-display text-2xl font-semibold leading-none text-brand-700">
        {value}
      </span>
      <span className="text-sm text-ink-600">
        {label}
        {source && (
          <span className="ml-1 text-xs text-ink-500">({source})</span>
        )}
      </span>
    </div>
  );
}
