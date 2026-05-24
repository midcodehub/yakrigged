'use client';

import Giscus from '@giscus/react';

export function GiscusComments() {
  return (
    <div className="mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-ink-900">Comments & Questions</h2>
      </div>
      {/* 采用纯净白底和细边框包裹，完美融合亮色主题 */}
      <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm sm:p-8">
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
          theme="noborder_light"
          lang="en"
          loading="lazy"
        />
      </div>
    </div>
  );
}
