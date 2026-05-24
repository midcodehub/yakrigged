import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/lib/consts';
import { getAllAuthorProfiles } from '@/lib/authors';
import { authorToSlug } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'About Us',
  description: `About ${SITE.name} — who we are, how we test gear, and why we publish.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const authors = getAllAuthorProfiles();

  return (
    <div className="mx-auto max-w-5xl space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-20 text-center sm:px-12 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-ink-900 to-ink-900" />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            We build better kayak anglers.
          </h1>
          <p className="text-xl leading-relaxed text-ink-300">
            {SITE.name} is an independent kayak fishing gear publication. We don&apos;t just read spec sheets—we test everything we recommend on real water, on multiple trips, in multiple conditions.
          </p>
        </div>
      </section>

      {/* How We Test Section */}
      <section>
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Our Testing Methodology
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            No fluff. No armchair reviews. Just field-tested truth.
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Rule 1 */}
          <div className="rounded-2xl border border-brand-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-bold text-ink-900">The 10-Hour Rule</h3>
            <p className="text-ink-600">
              Every piece of gear we review must be used on the water for a minimum of 10 hours before we write a single word.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="rounded-2xl border border-brand-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-bold text-ink-900">Real Measurements</h3>
            <p className="text-ink-600">
              We never trust manufacturer specs. We measure dimensions, weights, and battery life using our own independent tools.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="rounded-2xl border border-brand-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-bold text-ink-900">100% Transparent</h3>
            <p className="text-ink-600">
              If a product sucks, we&apos;ll tell you. We disclose every affiliate relationship clearly at the top of every article.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="rounded-3xl bg-brand-50 px-6 py-16 sm:px-12">
        <div className="mb-12 text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-ink-900">Who We Are</h2>
          <p className="mt-3 text-lg text-ink-600">
            A team of kayak anglers who spent too much money on bad gear, so you don&apos;t have to.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {authors.map((author) => (
            <div key={author.name} className="flex flex-col gap-6 sm:flex-row sm:items-start rounded-2xl bg-white p-6 shadow-sm border border-brand-100/50">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-bold text-brand-700 sm:h-20 sm:w-20">
                {author.avatar ? (
                  <Image src={author.avatar} alt={author.name} width={80} height={80} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl">{author.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-ink-900">
                  <Link href={`/authors/${authorToSlug(author.name)}`} className="hover:text-brand-600 hover:underline">
                    {author.name}
                  </Link>
                </h3>
                <p className="mb-3 mt-1 text-sm font-semibold text-brand-600">{author.title}</p>
                <p className="text-sm leading-relaxed text-ink-600">{author.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section className="text-center rounded-3xl border border-brand-100 bg-white px-6 py-16 sm:px-12">
        <h2 className="text-3xl font-bold tracking-tight text-ink-900">Get in Touch</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-600">
          Have a tip, a correction, or a gear suggestion? We&apos;re always open to hearing from fellow anglers.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:hello@yakrigged.com"
            className="inline-flex items-center justify-center rounded-full bg-ink-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
          >
            Email Us
          </a>
          <a
            href="https://www.facebook.com/groups/1490684123070837"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-brand-100 px-8 py-3.5 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-200"
          >
            Join Facebook Group
          </a>
        </div>
      </section>
    </div>
  );
}
