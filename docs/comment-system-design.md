# YakRigged 留言系统设计方案

> 博客评论/留言系统的架构设计与分期落地蓝本。
> 路线已定:**自建(Next.js API + Supabase)+ 匿名优先三档身份 + 图片上传放 P3**。
> 本文是实现的依据,动手前以此为准。

---

## 0. 决策摘要

| 决策点 | 选定方案 | 理由 |
|---|---|---|
| 技术路线 | 自建,Supabase 栈,分 3 期 | 唯一能 100% 实现需求 + UI 与站点统一 + 契合现有 API-route/抽象层模式 + 数据自有 |
| 身份模型 | 匿名优先三档(匿名 → 邮箱 → 社交登录) | 最低摩擦,又能跑通"回复通知"闭环 |
| 图片上传 | 放 P3,仅限已验证身份 + 自动审核 | 匿名 + 公开图 = 全站最高风险面,先把文字体验做扎实 |
| 现有 Giscus | P1 上线后**下线替换** | Giscus 无法满足匿名/踩/图片/自定义 emoji |

**核心原则**:自建 ≠ 造轮子。底层全用成熟件,只拼装 UI 和业务胶水。

---

## 1. 技术选型(钉死)

| 能力 | 选型 | 备注 |
|---|---|---|
| 数据库 | **Supabase Postgres** | 免费档 500MB,够起步 |
| 身份认证 | **Supabase Auth** | 匿名登录 + 邮箱 OTP + Google/GitHub OAuth,三档一套搞定 |
| 行级权限 | **Postgres RLS** | "只能改/删自己的留言"靠 RLS 在数据库层强制,不靠前端 |
| 对象存储 | **Supabase Storage**(P3) | 图片 + CDN + 签名 URL |
| 防机器人 | **Cloudflare Turnstile** | 免费,无感验证,替代 reCAPTCHA |
| 限流 | **Upstash Redis** + `@upstash/ratelimit` | serverless,Vercel 友好;对应你 subscribe 里"限流需 KV"的 TODO |
| emoji 选择器 | **`@emoji-mart/react`** | 成熟开源,emoji 是 Unicode 直接存文本 |
| 图片审核(P3) | **Sightengine** 或 **AWS Rekognition** | SafeSearch 打分自动拦色情/暴力/违法 |
| 图片处理(P3) | **`sharp`** | 服务端转码 + 剥 EXIF(去 GPS) |
| SDK | `@supabase/supabase-js` + `@supabase/ssr` | service_role key 只在服务端用 |

> 关键洞察:**Supabase 匿名登录**会给每个访客静默发一个持久 `uid`(存 localStorage),用户**全程无感**,但我们后端拿到了稳定身份 → 既能做"一人一票"去重,又能用 RLS 实现"改/删自己的留言"。邮箱/OAuth 只是在这个匿名 uid 上**升级绑定**,不另起炉灶。

---

## 2. 架构总览

```
浏览器(评论组件,'use client')
  │  1. 首次交互静默 signInAnonymously() → 拿到 supabase session(uid)
  │  2. 提交留言:带 Turnstile token + 蜜罐字段
  ▼
Next.js Route Handler  (app/api/comments/*)   ← 与现有 /api/subscribe 同构
  │  - 校验 Turnstile / 蜜罐 / 限流(Upstash)
  │  - 服务端反垃圾启发式(链接数/黑词)
  │  - 调 lib/comments 抽象层
  ▼
lib/comments/*  (service 层,封装 Supabase)    ← 与 lib/newsletter.ts 同构
  ▼
Supabase (Postgres + Auth + RLS + Storage)
```

- 前端**永远不直连**第三方写操作的敏感逻辑;读操作可走 Supabase 匿名 client + RLS。
- service_role key 只在 Route Handler 内使用,绝不进客户端 bundle(沿用你 subscribe 的纪律)。

---

## 3. 数据模型

### P1(MVP)

```sql
-- 留言主表
create table comments (
  id            uuid primary key default gen_random_uuid(),
  post_slug     text not null,                    -- 关联文章,如 'best-fishing-kayaks'
  parent_id     uuid references comments(id),     -- null=顶层;有值=线程回复
  author_id     uuid not null references auth.users(id),  -- 匿名/邮箱/OAuth 统一是 auth uid
  author_name   text,                             -- 展示昵称(可空→"Anonymous")
  author_type   text not null default 'anon',     -- anon | email | oauth | admin
  body          text not null check (char_length(body) between 1 and 4000),
  image_url     text,                             -- P3 才启用
  status        text not null default 'approved', -- approved | pending | spam | deleted
  like_count    integer not null default 0,       -- 触发器维护(并发安全)
  dislike_count integer not null default 0,
  ip_hash       text,                             -- 只存 hash,审计/限流用,不公开
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on comments (post_slug, status, created_at);

-- 赞/踩表:一个身份对一条留言只能一票
create table reactions (
  comment_id  uuid not null references comments(id) on delete cascade,
  voter_id    uuid not null,                      -- auth uid
  kind        text not null check (kind in ('like','dislike')),
  created_at  timestamptz not null default now(),
  primary key (comment_id, voter_id)              -- ← 防重复投票的硬约束
);
```

**并发安全的计数**(对应你"DB 必须考虑并发安全"的原则):
绝不用"读出来 +1 再写回"。用 Postgres **触发器**在 reactions 增删时,于**同一事务内**原子更新 `comments.like_count/dislike_count`。切换赞↔踩 = 删旧票 + 插新票,触发器自动调平。读取计数直接读列,零额外查询。

### P2 增量
```sql
alter table comments add column notify_email_hash text;  -- 被回复时邮件通知(邮箱只存hash/加密)
create table reports (                                    -- 用户举报
  id uuid primary key default gen_random_uuid(),
  comment_id uuid references comments(id), reporter_id uuid,
  reason text, created_at timestamptz default now()
);
```

### P3 增量
```sql
create table comment_images (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid references comments(id) on delete cascade,
  storage_path text not null,
  moderation_status text not null default 'pending',  -- pending|approved|rejected
  moderation_score jsonb,                              -- 审核API原始打分
  created_at timestamptz default now()
);
```

---

## 4. API 设计(Route Handlers)

全部放 `app/api/comments/`,沿用 subscribe 的写法(`runtime='nodejs'`、`dynamic='force-dynamic'`、统一 `{ok,status,message}` 返回)。

| 方法 + 路径 | 作用 | 校验 |
|---|---|---|
| `GET /api/comments?slug=` | 拉某文章的已审线程留言 | 公开读(RLS 只放行 approved) |
| `POST /api/comments` | 发留言/回复 | Turnstile + 蜜罐 + 限流 + 反垃圾启发式 |
| `PATCH /api/comments/:id` | 编辑自己的留言 | RLS:author_id = auth.uid() |
| `DELETE /api/comments/:id` | 软删自己的留言 | RLS 同上 |
| `POST /api/comments/:id/react` | 赞/踩(再点取消,赞↔踩切换) | 需 session;PK 去重 |
| `POST /api/comments/:id/report` (P2) | 举报 | 限流 |
| `POST /api/uploads` (P3) | 申请上传(仅验证身份) | author_type ∈ {email,oauth};签名 URL |

`lib/comments/` 抽象层(与 `lib/newsletter.ts` 同构):
```
lib/comments/
  client.ts       # 创建 supabase server client(service_role)
  service.ts      # listComments / createComment / react / softDelete ...
  moderation.ts   # 反垃圾启发式 + (P3)图片审核调用
  ratelimit.ts    # Upstash 封装,按 ip_hash + author_id 双键限流
```

---

## 5. 身份模型(三档,渐进增强)

| 档位 | 触发 | 解锁 | 实现 |
|---|---|---|---|
| **匿名(默认)** | 首次交互静默建会话 | 发文字、赞/踩、emoji | `auth.signInAnonymously()` |
| **邮箱** | 用户主动填邮箱 | + 被回复邮件通知 + 改删自己留言更稳 + **解锁传图** | `auth.signInWithOtp()` magic link,绑定到现有匿名 uid |
| **社交登录** | 点 Google/GitHub | + 持久身份 + 头像 + 高信任 | `auth.signInWithOAuth()` |

- **站长(你)**:登录账号在 env 白名单(`ADMIN_EMAILS` / uid)→ `author_type='admin'`,留言带 **"作者"徽章 + 可置顶 + 可审任意留言/封禁**。
- 昵称留空 → 前端显示 `Anonymous #ab12`(取 uid 短哈希,便于同一匿名者多条留言可识别)。

---

## 6. 反垃圾 / 审核策略(分期加码)

**P1 文字留言审核决策树(按顺序判定):**
1. 命中**敏感词黑名单** → 直接判 `rejected`(软拒绝:不展示、留底备查防误杀申诉,**不物理删除**)。**优先级最高**,即使同时带外链也先拒。
2. 否则**含外链** → 转 `pending` 进审核队列(人工放行);所有用户留言里的外链统一注入 `rel="nofollow ugc noopener noreferrer"`(UGC 不传权重,保护站点 SEO)。
3. 否则(无敏感词、无外链) → 直接 `approved` 公开。

配套基础层:
- Cloudflare Turnstile(无感人机验证)+ 蜜罐字段(沿用 subscribe 的 `website` 套路)
- Upstash 双键限流:匿名 ip_hash 维度 + author_id 维度(如 5 条/10 分钟)
- 极简 admin 队列页(`/admin/comments`,仅站长可见)处理 pending:放行 / 标记垃圾 / 删除
- 敏感词黑名单维护在代码里(`lib/comments/blocklist.ts`,版本可控、随时改),不放 env

**P2:** 用户举报(reports 表)+ 被举报达阈值自动转 pending。
**P3:** 图片自动审核(见 §8)。

---

## 7. emoji 聊天框

- 回复框右下角一个 😊 按钮,点开 `@emoji-mart/react` 面板,插入到光标处。
- emoji 是 Unicode 字符,**直接进 `body` 文本**,无需任何额外存储或字段。
- Facebook 风:输入框圆角、发送按钮、@提及(P2 可选)、Enter 发送/Shift+Enter 换行。

---

## 8. 图片上传(P3,重风险控制)

**铁律:纯匿名不能传图,只有"邮箱已验证 / 社交登录"身份可传。** 这一刀砍掉绝大多数滥用。

流程:
1. 前端请求 `POST /api/uploads` → 服务端校验身份档位 → 返回 Supabase Storage **签名上传 URL**
2. 上传后服务端 `sharp` **转码 + 剥 EXIF(去 GPS)** + 限尺寸/格式/大小
3. 调 **Sightengine/Rekognition SafeSearch** 打分:
   - 无**黄(成人/裸露)赌(赌博)毒(毒品/暴力)** → `approved`,留言带图公开
   - 命中上述任一类 → `rejected`,图片不显示 + 记录
   - 介于阈值之间不确定 → `pending`,进 admin 队列人工复核(先审后显)
4. 存储路径不进主域直链,走 CDN + 签名访问

---

## 9. 隐私合规

- 存了邮箱(hash/加密)、IP(hash)→ 面向全球(含欧盟 GDPR)流量,需在 **/privacy 补一段**:收集什么、为何收集(回复通知/反垃圾)、保留期、删除方式(用户可自助删留言)。
- 留言框旁一行小字:"提交即表示同意我们的[隐私政策]与[条款]"。
- 你已有 `/privacy`、`/terms` 页,到时各加一段即可。

---

## 10. 分期路线图

### P1 — MVP(文字社区,先上线替换 Giscus)
- 数据表 comments + reactions + 触发器计数
- Supabase 匿名登录(无感)
- 发留言 / 线程回复 / 软删改自己的
- 赞 + 踩(一人一票,可取消可切换)
- emoji 选择器
- 昵称(可选)+ 站长作者徽章 + 置顶
- 反垃圾:Turnstile + 蜜罐 + Upstash 限流 + 启发式 + admin 队列页
- FB 风 UI,套用站点设计语言(sand/ink/brand 色系、圆角、ring 边框)
- 文章页下线 Giscus,换上新组件

### P2 — 身份增强 + 互动闭环
- 可选邮箱(magic link)+ 社交登录(Google/GitHub)
- **被回复邮件通知**(复用你 Kit/邮件发送能力)
- 用户举报 + 阈值自动转 pending
- 头像(Gravatar / OAuth 头像)

### P3 — 图片上传(高风险,最后做)
- 仅限已验证身份上传
- sharp 转码剥 EXIF + Storage + CDN
- 自动图片审核 + 先审后显队列

---

## 11. P1 验收标准(WHEN / THEN)

- WHEN 访客首次点开回复框,THEN 后台静默建立匿名会话,用户无需任何注册动作。
- WHEN 匿名访客提交一条合法留言,THEN 留言即时出现在对应文章下,并持久化到 Supabase。
- WHEN 同一访客对同一留言先点赞再点踩,THEN 赞数 -1 且踩数 +1(净票守恒,无重复计数)。
- WHEN 两个请求并发对同一留言点赞,THEN 计数最终一致,无丢失更新(触发器 + PK 约束保证)。
- WHEN 访客编辑/删除**他人**留言,THEN 被 RLS 拒绝(数据库层,不靠前端隐藏按钮)。
- WHEN 机器人不带合法 Turnstile token 提交,THEN 服务端拒绝。
- WHEN 一条留言含超量链接,THEN 自动进 pending,不直接公开。
- WHEN 站长登录后留言,THEN 显示"作者"徽章,且可置顶/审任意留言。

---

## 12. 成本估算

| 项 | 起步 | 规模上来后 |
|---|---|---|
| Supabase | 免费档 | 超 500MB/storage 后 $25/mo Pro |
| Upstash | 免费档(1 万命令/天) | 按量,极低 |
| Turnstile | 免费 | 免费 |
| 图片审核(P3) | 免费额度 | 约 $0.001–0.002/张 |
| Vercel | 现有 | 现有 |

**结论:P1/P2 起步成本 ≈ $0。主要变动成本是 P3 的图片审核 API 和流量起来后的 Supabase Pro。**

---

## 13. 动手前需要你提供 / 确认

1. 新建一个 **Supabase 项目**(免费),把 `Project URL` / `anon key` / `service_role key` 给我配进 env
2. **Cloudflare Turnstile** 站点密钥(免费,几分钟)
3. **Upstash Redis** 实例(免费)
4. P2 才需要:Google / GitHub OAuth 应用凭据
5. 确认 P1 是否**先做 admin 审核队列页**,还是先"全部自动通过 + 事后清理"(影响 P1 工作量)
