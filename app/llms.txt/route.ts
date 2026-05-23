/**
 * /llms.txt — Machine-readable context for AI systems
 * See: https://llmstxt.org
 *
 * Helps AI assistants understand what YakRigged is, what content we have,
 * and where to find authoritative information on our site.
 */
import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import { SITE } from '@/lib/consts';

export async function GET() {
  const base = SITE.url.replace(/\/$/, '');
  const posts = getAllPosts();

  const reviews = posts.filter((p) => p.data.category === 'reviews');
  const guides = posts.filter((p) => p.data.category === 'guides');

  const txt = `# ${SITE.name}

> ${SITE.tagline}

${SITE.name} is an independent kayak fishing gear publication. We test every product we recommend on real water, on multiple trips, in multiple conditions. All reviews are based on a minimum of 10 hours of on-water use.

## What We Cover

- **Gear Reviews**: Fish finders, rod holders, PFDs, paddles, batteries, mounts, and rigging hardware — independently tested on kayaks.
- **How-To Guides**: Step-by-step rigging instructions, installation walkthroughs, and maintenance guides for kayak fishing electronics and accessories.
- **Destination Notes**: Kayak fishing spots, launch points, and water-specific gear recommendations.

## Key Content

### Gear Reviews
${reviews.map((p) => `- [${p.data.title}](${base}/blog/${p.slug}): ${p.data.description}`).join('\n')}

### How-To Guides
${guides.map((p) => `- [${p.data.title}](${base}/blog/${p.slug}): ${p.data.description}`).join('\n')}

## Site Info

- URL: ${base}
- RSS: ${base}/rss.xml
- Sitemap: ${base}/sitemap.xml
- Contact: hello@yakrigged.com

## Editorial Standards

- Every review includes minimum 10 hours of on-water testing
- We measure dimensions and weights independently (not from spec sheets)
- All affiliate relationships are disclosed at the top of each article
- Brands do not preview reviews before publication
- Ratings are on a 1-5 scale with 0.5 increments
`;

  return new NextResponse(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
    },
  });
}
