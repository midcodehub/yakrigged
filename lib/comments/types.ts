/**
 * 留言系统共享类型
 * --------------------------------------------------
 * 服务端落库的行 vs 返回给前端的"安全视图"(剥掉 ip_hash 等敏感字段)
 * 分开定义,避免敏感信息泄漏到客户端。
 */

export type CommentStatus =
  | 'approved'
  | 'pending'
  | 'spam'
  | 'rejected'
  | 'deleted';

export type AuthorType = 'anon' | 'email' | 'oauth' | 'admin';

export type ReactionKind = 'like' | 'dislike';

/** 数据库里的一行(服务端用) */
export interface CommentRow {
  id: string;
  post_slug: string;
  parent_id: string | null;
  author_id: string;
  author_name: string | null;
  author_type: AuthorType;
  body: string;
  image_url: string | null;
  status: CommentStatus;
  pinned: boolean;
  like_count: number;
  dislike_count: number;
  ip_hash: string | null;
  created_at: string;
  updated_at: string;
}

/** 返回给前端的安全视图(无 ip_hash / author_id 仅用于判断"是不是我") */
export interface PublicComment {
  id: string;
  parentId: string | null;
  authorName: string;
  authorType: AuthorType;
  body: string;
  imageUrl: string | null;
  pinned: boolean;
  likeCount: number;
  dislikeCount: number;
  createdAt: string;
  /** 当前访客对这条留言投了什么票(null=没投) */
  myReaction: ReactionKind | null;
  /** 这条留言是不是当前访客发的(决定是否显示"编辑/删除") */
  isMine: boolean;
}

/** 统一 API 返回包(沿用 subscribe 的 {ok,status,message} 风格) */
export type ApiResult<T = unknown> =
  | { ok: true; status: string; data?: T }
  | { ok: false; status: string; message?: string };
