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
      className="my-6 rounded-lg border-l-4 border-brand-500 bg-brand-50/50 p-4 sm:p-5"
    >
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-700">
        {label}
      </p>
      <div className="text-sm leading-relaxed text-ink-900 [&>p]:m-0">
        {children}
      </div>
    </aside>
  );
}
