'use client';

/**
 * 评论区懒加载包装
 * --------------------------------------------------
 * 为什么:评论区在文章折叠线以下,而它依赖 supabase-js / emoji-mart,
 * 体积不小。本站是 SEO 站,文章首屏 JS 越小越好(直接关系 Core Web Vitals)。
 * 所以这里用 IntersectionObserver:用户滚动到评论区附近(提前 400px)才
 * 动态加载真正的 CommentsSection,把这些依赖完全移出文章关键渲染路径。
 */
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const CommentsSection = dynamic(
  () => import('./CommentsSection').then((m) => m.CommentsSection),
  {
    ssr: false,
    loading: () => <p className="text-sm text-ink-400">Loading comments…</p>,
  },
);

export function CommentsLazy({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px' }, // 提前 400px 预加载,滚到时已就绪
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={ref}>
      {show ? (
        <CommentsSection slug={slug} />
      ) : (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-ink-900">Comments</h2>
          <div className="rounded-2xl bg-white p-6 text-sm text-ink-400 ring-1 ring-sand-200">
            Scroll down to load the conversation…
          </div>
        </section>
      )}
    </div>
  );
}
