/**
 * 渲染留言正文:把其中的链接转成 <a>,并统一注入 rel="nofollow ugc"
 * --------------------------------------------------
 * UGC 链接不传递权重(保护站点 SEO),且新窗口打开 + noopener。
 * 纯文本按换行保留;不渲染任何 HTML(防 XSS,只识别 URL)。
 */
import { Fragment } from 'react';

// 与服务端 blocklist 的 URL 检测保持一致的思路(这里用于切分渲染)
const URL_SPLIT =
  /((?:https?:\/\/|www\.)[^\s]+)/gi;

export function CommentBody({ text }: { text: string }) {
  const parts = text.split(URL_SPLIT);
  return (
    <p className="whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed text-ink-800">
      {parts.map((part, i) => {
        const isUrl = /^(?:https?:\/\/|www\.)/i.test(part);
        if (!isUrl) return <Fragment key={i}>{part}</Fragment>;
        const href = part.startsWith('http') ? part : `https://${part}`;
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="nofollow ugc noopener noreferrer"
            className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            {part}
          </a>
        );
      })}
    </p>
  );
}
