/**
 * Twitter / X Card 图 —— 直接复用 OG 图。
 * 单独写一个文件是因为 Next.js 会用 alt 作为 twitter:image:alt，
 * 而 og 与 twitter 的 alt 我们希望同步即可。
 */
export {
  default,
  size,
  contentType,
  alt,
} from './opengraph-image';
