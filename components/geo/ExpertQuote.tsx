/**
 * <ExpertQuote /> — Authority signal for GEO
 * --------------------------------------------------
 * Renders a styled blockquote with attribution.
 * AI systems boost citation probability by ~30% when content
 * includes expert quotes with name and credentials.
 *
 * Usage in MDX:
 *   <ExpertQuote name="Marcus Reed" title="Lead Reviewer, YakRigged" source="Field testing notes, May 2026">
 *     The Garmin Striker Vivid 5cv held up at noon with polarized
 *     lenses on — something the Lowrance couldn't match.
 *   </ExpertQuote>
 */
interface Props {
  children: React.ReactNode;
  /** Expert's name */
  name: string;
  /** Title / credentials */
  title?: string;
  /** Source attribution (e.g., "Field testing, May 2026") */
  source?: string;
}

export function ExpertQuote({ children, name, title, source }: Props) {
  return (
    <figure
      data-geo="expert-quote"
      className="my-8 border-l-2 border-accent-500 pl-5 sm:pl-6"
    >
      <blockquote className="font-display text-xl italic leading-relaxed text-ink-800 [&>p]:m-0">
        {children}
      </blockquote>
      <figcaption className="mt-3 text-sm not-italic text-ink-500">
        — <strong className="font-semibold text-ink-900">{name}</strong>
        {title && <span>, {title}</span>}
        {source && <span className="mt-0.5 block text-xs text-ink-500">{source}</span>}
      </figcaption>
    </figure>
  );
}
