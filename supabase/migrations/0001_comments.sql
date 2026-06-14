-- =====================================================================
-- YakRigged 留言系统 — P1 建表脚本
-- ---------------------------------------------------------------------
-- 在 Supabase 后台 → SQL Editor 里整段粘贴执行即可(幂等,可重复跑)。
-- 设计文档:docs/comment-system-design.md
--
-- 安全模型:
--   - 所有写操作走服务端 service_role(绕过 RLS),在 Route Handler 里
--     完成 Turnstile / 限流 / 敏感词 / 审核后再落库。
--   - RLS 作为纵深防御:即使 anon key 泄露,也只能【读到已审留言】,
--     读不到 pending/rejected,更不能写。
-- =====================================================================

-- 留言主表 -----------------------------------------------------------
create table if not exists public.comments (
  id            uuid primary key default gen_random_uuid(),
  post_slug     text not null,                       -- 关联文章 slug
  parent_id     uuid references public.comments(id) on delete cascade, -- null=顶层;有值=回复
  author_id     uuid not null,                       -- 来自已验证的 Supabase 会话 uid(匿名/邮箱/OAuth 统一)
  author_name   text,                                -- 展示昵称;空→前端显示 Anonymous
  author_type   text not null default 'anon'
                  check (author_type in ('anon','email','oauth','admin')),
  body          text not null check (char_length(body) between 1 and 4000),
  image_url     text,                                -- P3 才启用
  status        text not null default 'approved'
                  check (status in ('approved','pending','spam','rejected','deleted')),
  pinned        boolean not null default false,      -- 站长置顶
  like_count    integer not null default 0,          -- 由触发器维护(并发安全)
  dislike_count integer not null default 0,
  ip_hash       text,                                -- 只存 hash,限流/审计用,不公开
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists comments_slug_status_idx
  on public.comments (post_slug, status, created_at desc);
create index if not exists comments_parent_idx
  on public.comments (parent_id);

-- 赞/踩表:一个身份对一条留言只能一票 -------------------------------
create table if not exists public.reactions (
  comment_id  uuid not null references public.comments(id) on delete cascade,
  voter_id    uuid not null,                         -- 已验证会话 uid
  kind        text not null check (kind in ('like','dislike')),
  created_at  timestamptz not null default now(),
  primary key (comment_id, voter_id)                 -- ← 防重复投票的硬约束
);
create index if not exists reactions_voter_idx on public.reactions (voter_id);

-- 并发安全的计数:触发器在【同一事务内】原子增减计数列 ------------
-- 切换 赞↔踩 = UPDATE kind,触发器自动调平两个计数。
create or replace function public.bump_reaction_counts()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'INSERT') then
    update public.comments set
      like_count    = like_count    + (case when new.kind = 'like'    then 1 else 0 end),
      dislike_count = dislike_count + (case when new.kind = 'dislike' then 1 else 0 end)
    where id = new.comment_id;
  elsif (tg_op = 'DELETE') then
    update public.comments set
      like_count    = like_count    - (case when old.kind = 'like'    then 1 else 0 end),
      dislike_count = dislike_count - (case when old.kind = 'dislike' then 1 else 0 end)
    where id = old.comment_id;
  elsif (tg_op = 'UPDATE') then
    update public.comments set
      like_count    = like_count
                        + (case when new.kind = 'like'    then 1 else 0 end)
                        - (case when old.kind = 'like'    then 1 else 0 end),
      dislike_count = dislike_count
                        + (case when new.kind = 'dislike' then 1 else 0 end)
                        - (case when old.kind = 'dislike' then 1 else 0 end)
    where id = new.comment_id;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_reaction_counts on public.reactions;
create trigger trg_reaction_counts
  after insert or update or delete on public.reactions
  for each row execute function public.bump_reaction_counts();

-- RLS:纵深防御 -----------------------------------------------------
alter table public.comments  enable row level security;
alter table public.reactions enable row level security;

-- 唯一对外放行的能力:任何人可【读已审留言】。
-- 其余增删改 + 读 pending/rejected 一律无策略 = 默认拒绝;
-- 服务端 service_role 会绕过 RLS,正常工作。
drop policy if exists "public read approved comments" on public.comments;
create policy "public read approved comments"
  on public.comments for select
  using (status = 'approved');
