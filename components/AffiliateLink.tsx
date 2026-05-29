/**
 * <AffiliateLink asin="..." region="com">显示文字</AffiliateLink>
 * --------------------------------------------------------------
 * MDX 里写 affiliate 链接的"懒人写法"——只需要从 Amazon 商品页
 * 复制 ASIN（10 位代码），组件自动：
 *   - 拼成 https://www.amazon.<region>/dp/<ASIN>?tag=<你的tag>
 *   - 注入 rel="nofollow sponsored noopener noreferrer"
 *   - 加 target="_blank"
 *
 * 用法：
 *   <AffiliateLink asin="B07YPN7XYZ">Railblaza StarPort HD</AffiliateLink>
 *
 * 跨区域（英国/德国/日本等）：
 *   <AffiliateLink asin="B07YPN7XYZ" region="co.uk">UK Store</AffiliateLink>
 *
 * 为什么不用 amzn.to 短链：
 *   1. 一个 ASIN 永久有效，不依赖 Associates Dashboard 单条生成
 *   2. 链接里 ASIN 可见，文章 grep 友好，将来批量改 tag 一键搞定
 *   3. 没有 amzn.to 的 302 跳转，页面 LCP 略快
 *   4. 长链对部分 ad blocker 透明度更好（短链有时被屏蔽）
 *
 * tag 缺失时的行为：
 *   - 若 NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG 未配置，渲染普通 Amazon 链接
 *     （不带 tag，没佣金但不会 404；构建时 console.warn 一次提醒）
 */
import type { ReactNode } from 'react';
import {
  buildAmazonUrl,
  DEFAULT_AMAZON_TAG,
  type AmazonRegion,
} from '@/lib/amazon';

interface Props {
  /** Amazon ASIN（10 位字母数字代码，在商品 URL 的 /dp/ 后面） */
  asin: string;
  /** Amazon 区域站点，默认 com（美国） */
  region?: AmazonRegion;
  /** 链接显示的文字（产品名） */
  children: ReactNode;
  /**
   * 可选：覆盖默认的 Associates tag。
   * 99% 情况下不需要——用全局 env 配置的 tag 即可。
   * 仅当你给某一篇文章接入不同的 tag（比如 A/B 测试用）才传这个。
   */
  tag?: string;
}

/** 仅在构建期打一次警告，避免 SSG 期每个用法都重复 warn */
let warnedMissingTag = false;

export function AffiliateLink({
  asin,
  region = 'com',
  children,
  tag,
}: Props) {
  // 防御：ASIN 缺失直接降级为纯文本，别让链接坏掉
  if (!asin) {
    if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
      console.warn('[AffiliateLink] missing asin prop, rendering as plain text');
    }
    return <span>{children}</span>;
  }

  const effectiveTag = tag || DEFAULT_AMAZON_TAG;

  if (!effectiveTag && !warnedMissingTag && typeof window === 'undefined') {
    console.warn(
      '[AffiliateLink] NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG not set — ' +
        'links will not earn commission. Set it in Vercel env to enable.',
    );
    warnedMissingTag = true;
  }

  // 拼装 URL：基础形式 https://www.amazon.<region>/dp/<ASIN>?tag=<TAG>
  // 复用 lib/amazon 的共享逻辑，避免和 VerdictBox 等组件各拼一套。
  const url = buildAmazonUrl(asin, region, tag);

  return (
    <a
      href={url}
      target="_blank"
      // Google + Amazon Associates 双方硬性要求的 rel 组合
      rel="nofollow sponsored noopener noreferrer"
      data-affiliate="amazon"
      data-asin={asin}
    >
      {children}
    </a>
  );
}
