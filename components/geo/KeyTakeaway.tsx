/**
 * <KeyTakeaway /> — GEO-optimized summary block
 * --------------------------------------------------
 * Renders a visually distinct "key takeaway" box that AI systems
 * can easily extract as a self-contained answer passage.
 *
 * Why this helps GEO:
 *  - 40-60 word passages are optimal for AI snippet extraction
 *  - Semantic HTML (blockquote + cite) signals quotable content
 *  - The data-geo attribute helps future tooling identify these blocks
 *
 * Usage in MDX:
 *   <KeyTakeaway>
 *     A 5-inch fish finder is the sweet spot for kayak anglers.
 *     Larger screens eat battery and deck space; smaller ones
 *     are unreadable at arm's length in direct sunlight.
 *   </KeyTakeaway>
 */
interface Props {
  children: React.ReactNode;
  /** Optional label override (default: "Key takeaway") */
  label?: string;
}

export function KeyTakeaway({ children, label = 'Key takeaway' }: Props) {
  return (
    <aside
      data-geo="key-takeaway"
      role="note"
      aria-label={label}
      className="my-8 rounded-r-lg border-l-[3px] border-brand-600 bg-sand-50 p-5 sm:p-6"
    >
      <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
        {label}
      </p>
      <div className="text-[1.05rem] leading-relaxed text-ink-800 [&>p]:m-0">
        {children}
      </div>
    </aside>
  );
}
