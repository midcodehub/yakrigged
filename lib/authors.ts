/**
 * 作者档案
 * --------------------------------------------------
 * 简单起见，作者元数据写在 TS 里。如果以后超过 20 个作者再考虑挪到 JSON / CMS。
 *
 * 为什么需要：Google E-E-A-T 评估算法非常看重作者署名页（"author bio page"）。
 * 一个文章页只挂一个名字、没有专门的作者档案，会被判定为低权威性。
 */

import { authorToSlug } from './posts';

export interface AuthorProfile {
  /** 显示名（必须与 frontmatter 里的 author 字段完全一致） */
  name: string;
  /** 一句话头衔 */
  title: string;
  /** 1–3 段 Bio */
  bio: string;
  /** 头像 URL（相对 /public 或绝对） */
  avatar?: string;
  /** 社交链接 */
  links?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
  /** 与该作者强相关的领域关键词，渲染到档案页头部 */
  expertise?: string[];
}

/**
 * 作者档案库。Key 是 authorToSlug(name) 的结果。
 * 添加新作者时，先在文章 frontmatter 里 author: "..."，
 * 然后在这里补一条同名记录。两边名字必须 1:1。
 */
const AUTHORS: AuthorProfile[] = [
  {
    name: 'Marcus Reed',
    title: 'Senior Gear Editor · Kayak Angler 12+ yrs',
    bio:
      'Marcus has been fishing from kayaks since 2012. He owns six hulls across sit-on-top, pedal-drive and inflatable categories, and rigs all of them himself. Before joining YakRigged he wrote gear reviews for Field & Stream Online and contributed to the Kayak Anglers Association newsletter.',
    expertise: ['Fish finders', 'Rigging & DIY', 'Saltwater kayak fishing'],
    links: {
      instagram: 'https://instagram.com/_yakrigged_demo',
    },
  },
  {
    name: 'YakRigged Editorial',
    title: 'The YakRigged team',
    bio:
      'Articles signed "YakRigged Editorial" are collaborative pieces — usually news, announcements, or curated roundups — that don\'t have a single primary author. Individual reviews and guides are always signed by their author.',
  },
];

const BY_SLUG = new Map<string, AuthorProfile>(
  AUTHORS.map((a) => [authorToSlug(a.name), a]),
);

export function getAuthorBySlug(slug: string): AuthorProfile | null {
  return BY_SLUG.get(slug) ?? null;
}

export function getAuthorByName(name: string): AuthorProfile | null {
  return getAuthorBySlug(authorToSlug(name));
}

export function getAllAuthorProfiles(): AuthorProfile[] {
  return AUTHORS;
}
