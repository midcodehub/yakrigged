/**
 * 站点级默认 OG 图（1200×630）
 * --------------------------------------------------
 * Next.js App Router 约定：app/opengraph-image.tsx 默认导出 ImageResponse，
 * 编译时会生成一张 /opengraph-image.png（hash 化命名），
 * 并自动注入到 <meta property="og:image"> 与 <meta name="twitter:image">。
 *
 * 这里只用纯 inline 样式，不引外部字体，构建无网络依赖。
 */
import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/consts';

// 尺寸常量：Facebook / X / LinkedIn 都推荐 1200×630
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${SITE.name} — ${SITE.tagline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          // 品牌色径向渐变背景
          background:
            'radial-gradient(circle at 20% 30%, #2d8c7c 0%, #195a52 60%, #0f3833 100%)',
          color: '#ffffff',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* 品牌色方块代替 emoji —— Satori 渲染普通 div 极其稳定，
              而 emoji 在 Vercel build 环境里需要单独的字体包，会卡 build。 */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#f08a3e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 800,
              color: '#0b1220',
            }}
          >
            Y
          </div>
          <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
            {SITE.name}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p
            style={{
              fontSize: 30,
              color: '#aedfd3',
              textTransform: 'uppercase',
              letterSpacing: 4,
              margin: 0,
            }}
          >
            Kayak Anglers · Independent Reviews
          </p>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 1000,
            }}
          >
            Get rigged. Get on the water. Catch more fish.
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 28,
            color: '#d6efe9',
          }}
        >
          <span>{SITE.url.replace(/^https?:\/\//, '')}</span>
          <span style={{ color: '#f08a3e', fontWeight: 700 }}>
            Tested on the water
          </span>
        </div>
      </div>
    ),
    size,
  );
}
