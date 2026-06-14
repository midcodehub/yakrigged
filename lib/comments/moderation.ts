/**
 * 文字留言审核决策树(P1)
 * --------------------------------------------------
 * 按顺序判定,优先级从高到低:
 *   ① 命中敏感词        → rejected(不展示;软拒绝,留底防误杀)
 *   ② 否则含外链        → pending(进人审队列;外链前端注入 rel=nofollow ugc)
 *   ③ 否则(都没有)    → approved(直接公开)
 *
 * 敏感词优先级最高:即使同时带外链也先拒,不让明显垃圾占用人审时间。
 */
import { findSensitiveWord, hasExternalLink } from './blocklist';
import type { CommentStatus } from './types';

export interface ModerationResult {
  status: Extract<CommentStatus, 'approved' | 'pending' | 'rejected'>;
  /** 命中原因,记日志/给前端提示用 */
  reason: 'sensitive_word' | 'external_link' | 'clean';
  /** 命中的具体敏感词(便于排查误杀) */
  matched?: string;
}

export function moderateText(body: string): ModerationResult {
  const sensitive = findSensitiveWord(body);
  if (sensitive) {
    return { status: 'rejected', reason: 'sensitive_word', matched: sensitive };
  }
  if (hasExternalLink(body)) {
    return { status: 'pending', reason: 'external_link' };
  }
  return { status: 'approved', reason: 'clean' };
}
