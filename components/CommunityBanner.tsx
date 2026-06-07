export function CommunityBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-900 px-6 py-10 text-center text-white shadow-lg sm:px-10 sm:py-12">
      {/* 等深线纹理 —— 与首页 hero / CTA banner 一致，取代通用 blur blob */}
      <svg
        aria-hidden
        viewBox="0 0 1200 320"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full text-brand-300 opacity-[0.12]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M-40 90 C 240 55 460 140 700 90 S 1100 45 1320 105" />
        <path d="M-40 170 C 250 135 450 220 690 170 S 1110 120 1320 185" />
        <path d="M-40 250 C 240 215 460 300 700 248 S 1100 198 1320 265" />
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent-500/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-xl">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
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
