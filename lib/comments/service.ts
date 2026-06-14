/**
 * 留言核心业务层(服务端)
 * --------------------------------------------------
 * 与 lib/newsletter.ts 同构:Route Handler 只调这里的纯函数,
 * 所有 Supabase 细节封装在内。便于单测和将来替换。
 */
import { getAdminSupabase } from './db';
import { moderateText } from './moderation';
import type {
  AuthorType,
  CommentRow,
  PublicComment,
  ReactionKind,
} from './types';

/** DB 行 → 前端安全视图(剥掉 ip_hash / author_id) */
function toPublic(
  row: CommentRow,
  viewerId: string | null,
  myReactions: Map<string, ReactionKind>,
): PublicComment {
  const name =
    row.author_name?.trim() ||
    (row.author_type === 'admin'
      ? 'YakRigged'
      : `Anonymous·${row.author_id.slice(0, 4)}`);
  return {
    id: row.id,
    parentId: row.parent_id,
    authorName: name,
    authorType: row.author_type,
    body: row.body,
    imageUrl: row.image_url,
    pinned: row.pinned,
    likeCount: row.like_count,
    dislikeCount: row.dislike_count,
    createdAt: row.created_at,
    myReaction: myReactions.get(row.id) ?? null,
    isMine: viewerId != null && row.author_id === viewerId,
  };
}

/** 拉某文章的全部已审留言(扁平返回,前端自行建树) */
export async function listComments(
  slug: string,
  viewerId: string | null,
): Promise<PublicComment[]> {
  const db = getAdminSupabase();
  const { data: rows, error } = await db
    .from('comments')
    .select('*')
    .eq('post_slug', slug)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });
  if (error) throw error;
  const comments = (rows ?? []) as CommentRow[];

  // 取当前访客对这些留言的投票,用于高亮"我投过的"
  const myReactions = new Map<string, ReactionKind>();
  if (viewerId && comments.length > 0) {
    const ids = comments.map((c) => c.id);
    const { data: reacts } = await db
      .from('reactions')
      .select('comment_id, kind')
      .eq('voter_id', viewerId)
      .in('comment_id', ids);
    for (const r of reacts ?? []) {
      myReactions.set(r.comment_id as string, r.kind as ReactionKind);
    }
  }

  return comments.map((row) => toPublic(row, viewerId, myReactions));
}

export interface CreateCommentInput {
  slug: string;
  parentId: string | null;
  body: string;
  authorName: string | null;
  authorId: string;
  authorType: AuthorType;
  ipHash: string;
}

/** 发表留言/回复;内部跑审核决策树决定 status */
export async function createComment(input: CreateCommentInput): Promise<{
  comment: PublicComment | null;
  status: string;
  reason: string;
}> {
  const db = getAdminSupabase();
  const mod = moderateText(input.body);

  const { data, error } = await db
    .from('comments')
    .insert({
      post_slug: input.slug,
      parent_id: input.parentId,
      author_id: input.authorId,
      author_name: input.authorName,
      author_type: input.authorType,
      body: input.body,
      status: mod.status,
      ip_hash: input.ipHash,
    })
    .select('*')
    .single();
  if (error) throw error;

  const row = data as CommentRow;
  // 只有 approved 才回传可渲染对象;pending/rejected 回传 null,前端给相应提示
  const comment =
    mod.status === 'approved'
      ? toPublic(row, input.authorId, new Map())
      : null;
  return { comment, status: mod.status, reason: mod.reason };
}

/** 点赞/踩:再点同款=取消,点反款=切换。计数由 DB 触发器维护。 */
export async function reactToComment(
  commentId: string,
  voterId: string,
  kind: ReactionKind,
): Promise<{ likeCount: number; dislikeCount: number; myReaction: ReactionKind | null }> {
  const db = getAdminSupabase();

  const { data: existing } = await db
    .from('reactions')
    .select('kind')
    .eq('comment_id', commentId)
    .eq('voter_id', voterId)
    .maybeSingle();

  let myReaction: ReactionKind | null;
  if (!existing) {
    await db.from('reactions').insert({ comment_id: commentId, voter_id: voterId, kind });
    myReaction = kind;
  } else if (existing.kind === kind) {
    await db.from('reactions').delete().eq('comment_id', commentId).eq('voter_id', voterId);
    myReaction = null;
  } else {
    await db
      .from('reactions')
      .update({ kind })
      .eq('comment_id', commentId)
      .eq('voter_id', voterId);
    myReaction = kind;
  }

  // 读触发器维护后的最新计数
  const { data: c } = await db
    .from('comments')
    .select('like_count, dislike_count')
    .eq('id', commentId)
    .single();
  return {
    likeCount: c?.like_count ?? 0,
    dislikeCount: c?.dislike_count ?? 0,
    myReaction,
  };
}

/** 编辑自己的留言(校验归属);改完重跑审核 */
export async function editOwnComment(
  commentId: string,
  authorId: string,
  body: string,
): Promise<{ ok: boolean; status: string }> {
  const db = getAdminSupabase();
  const { data: row } = await db
    .from('comments')
    .select('author_id, status')
    .eq('id', commentId)
    .single();
  if (!row || row.author_id !== authorId || row.status === 'deleted') {
    return { ok: false, status: 'forbidden' };
  }
  const mod = moderateText(body);
  const { error } = await db
    .from('comments')
    .update({ body, status: mod.status, updated_at: new Date().toISOString() })
    .eq('id', commentId);
  if (error) throw error;
  return { ok: true, status: mod.status };
}

/** 软删自己的留言(保留行,清空内容) */
export async function softDeleteOwnComment(
  commentId: string,
  authorId: string,
): Promise<boolean> {
  const db = getAdminSupabase();
  const { data: row } = await db
    .from('comments')
    .select('author_id')
    .eq('id', commentId)
    .single();
  if (!row || row.author_id !== authorId) return false;
  await db
    .from('comments')
    .update({ status: 'deleted', body: '[deleted]', image_url: null })
    .eq('id', commentId);
  return true;
}

// ---------- 站长后台 ----------

/** 拉待审(pending)队列 */
export async function listPending(): Promise<CommentRow[]> {
  const db = getAdminSupabase();
  const { data } = await db
    .from('comments')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  return (data ?? []) as CommentRow[];
}

/** 站长改状态:放行 / 标垃圾 / 删除 */
export async function adminSetStatus(
  commentId: string,
  status: 'approved' | 'spam' | 'deleted',
): Promise<void> {
  const db = getAdminSupabase();
  await db.from('comments').update({ status }).eq('id', commentId);
}

/** 站长置顶/取消置顶 */
export async function adminSetPinned(commentId: string, pinned: boolean): Promise<void> {
  const db = getAdminSupabase();
  await db.from('comments').update({ pinned }).eq('id', commentId);
}
