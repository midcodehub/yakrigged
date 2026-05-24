'use client';

import Giscus from '@giscus/react';

export function GiscusComments() {
  return (
    <div className="mt-16 border-t border-brand-100 pt-10">
      <div className="mb-8 rounded-xl bg-brand-50/50 p-6 text-center border border-brand-100">
        <h2 className="mb-2 text-xl font-bold text-ink-900">
          Got a question or wanna show off your rig?
        </h2>
        <p className="text-sm text-ink-700">
          Drop a comment below, or join our exclusive{' '}
          <a
            href="https://www.facebook.com/groups/1490684123070837"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-700 hover:underline"
          >
            Facebook Group
          </a>{' '}
          to share photos of your kayak setup and get help from the community!
        </p>
      </div>

      <Giscus
        id="comments"
        repo="midcodehub/yakrigged"
        repoId="R_kgDOSlhMgA"
        category="General"
        categoryId="DIC_kwDOSlhMgM4C9vTZ"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="preferred_color_scheme"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
