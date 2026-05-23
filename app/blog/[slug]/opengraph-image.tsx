/**
 * 每篇文章独立的 OG 图（构建时静态生成）
 * --------------------------------------------------
 * 每个 slug 都会预渲染一张 /blog/<slug>/opengraph-image.png，
 * 自动注入到该路由的 og:image / twitter:image。
 *
 * 设计上保持极简：左上品牌徽标、中部大字标题、底部分类徽章 + 域名。
 * 不引外部字体，所有样式 inline，确保 build 阶段无网络依赖。
 */
import { ImageResponse } from 'next/og';
import { getAllSlugs, getPostBySlug } from '@/lib/posts';
import { SITE } from '@/lib/consts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** 让每个 slug 都有对应的静态 OG 图 */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/** 每张图的 alt（自动写进 og:image:alt / twitter:image:alt） */
export function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  return [
    {
      id: 'main',
      alt: post ? post.data.title : SITE.name,
      contentType,
      size,
    },
  ];
}

export default function OgImage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  // 防御性：万一传错 slug，至少别让 build 崩
  const title = post?.data.title ?? SITE.name;
  const category = post?.data.category ?? 'guides';
  const readingTime = post?.readingTime ?? '';

  // 标题分级字号：长标题自动缩小，避免溢出
  const titleSize = title.length > 60 ? 56 : title.length > 40 ? 64 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 80px',
          background:
            'linear-gradient(135deg, #0f3833 0%, #195a52 50%, #1f7065 100%)',
          color: '#ffffff',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
        }}
      >
        {/* 顶部：品牌徽标
            注意：不要在 ImageResponse 里用 emoji——Vercel 构建沙箱默认没有
            emoji 字体，会让 next/og 静默卡死。用纯 CSS 形状 + 文字最稳。 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 32,
            fontWeight: 700,
            color: '#d6efe9',
            letterSpacing: -0.5,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: '#f08a3e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 800,
              color: '#0b1220',
            }}
          >
            Y
          </div>
          <span>{SITE.name}</span>
        </div>

        {/* 中部：分类徽章 + 标题（用 marginTop: auto 推到中下偏上） */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            marginTop: 'auto',
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <span
              style={{
                background: '#f08a3e',
                color: '#0b1220',
                padding: '8px 18px',
                borderRadius: 999,
                fontSize: 24,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              {category}
            </span>
          </div>

          <h1
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 1040,
              letterSpacing: -1,
            }}
          >
            {title}
          </h1>
        </div>

        {/* 底部：域名 + 阅读时长 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 26,
            color: '#aedfd3',
            borderTop: '1px solid rgba(214, 239, 233, 0.25)',
            paddingTop: 24,
          }}
        >
          <span>{SITE.url.replace(/^https?:\/\//, '')}</span>
          {readingTime && <span>{readingTime}</span>}
        </div>
      </div>
    ),
    size,
  );
}
