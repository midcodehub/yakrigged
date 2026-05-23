/**
 * YouTube 嵌入组件
 * --------------------------------------------
 * 用于在 MDX 文章里嵌入 YouTube 视频，做了三件事：
 *
 *   1. 16:9 自适应容器（aspect-video），在手机上也不会破坏排版；
 *   2. 走 youtube-nocookie.com 域名，访问者未点击播放前不会被 Google 种 cookie，
 *      有利于隐私合规和 PageSpeed/Core Web Vitals 评分；
 *   3. loading="lazy"，进入视口前不发起请求，避免拖累首屏 LCP。
 *
 * 用法（MDX）：
 *   <YouTube id="8AVZXOLMyiA" title="How to Install a Flush Mount Rod Holder" />
 *
 * 可选 caption：渲染在视频下方，用于注明来源频道或推荐理由。
 */
interface YouTubeProps {
  /** YouTube 视频 ID（URL 中 v= 后面那段） */
  id: string;
  /** 无障碍标题，会读给屏幕阅读器，也作为 iframe title 提升 SEO */
  title: string;
  /** 视频下方的说明文字，可放频道名 / 时长 / 推荐理由 */
  caption?: string;
}

export function YouTube({ id, title, caption }: YouTubeProps) {
  return (
    <figure className="my-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
