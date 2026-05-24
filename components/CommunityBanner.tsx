export function CommunityBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-6 py-10 text-center text-white shadow-lg sm:px-10 sm:py-12">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-brand-300/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl"
      />
      
      <div className="relative mx-auto max-w-xl">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Show off your rig. Get help from experts.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-brand-50">
          Join our exclusive Facebook Group to share photos of your kayak setup, ask wiring questions, and buy/sell gear with fellow anglers.
        </p>
        <div className="mt-8">
          <a
            href="https://www.facebook.com/groups/1490684123070837"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full bg-accent-500 px-8 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 sm:w-auto"
          >
            Join the Facebook Community
          </a>
        </div>
      </div>
    </div>
  );
}
