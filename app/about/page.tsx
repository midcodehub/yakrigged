/**
 * /about
 * 简短的 about 页：给 E-E-A-T 信号与作者署名锚点。
 * Google 看到独立站没 about 页会怀疑可信度。
 */
import type { Metadata } from 'next';
import { SITE } from '@/lib/consts';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${SITE.name} — who we are, how we test gear, and why we publish.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <article className="prose prose-lg mx-auto max-w-3xl">
      <h1>About {SITE.name}</h1>
      <p className="lead">
        YakRigged is an independent kayak fishing gear publication. We test
        everything we recommend on real water, on multiple trips, in multiple
        conditions.
      </p>

      <h2>How we test</h2>
      <ul>
        <li>Every review is based on a minimum of 10 hours of on-water use.</li>
        <li>We measure dimensions and weights with our own tools, not the spec sheet.</li>
        <li>We disclose every affiliate relationship at the top of the article.</li>
      </ul>

      <h2>Who we are</h2>
      <p>
        We&apos;re a small team of kayak anglers based around freshwater lakes
        and coastal estuaries. We&apos;ve been rigging boats for two decades
        collectively.
      </p>

      <h2>Contact</h2>
      <p>
        Have a tip, a correction, or a gear suggestion? Email{' '}
        <a href="mailto:hello@yakrigged.com">hello@yakrigged.com</a>.
      </p>
    </article>
  );
}
