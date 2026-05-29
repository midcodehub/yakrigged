/**
 * Amazon Associates 链接拼装（共享工具）
 * --------------------------------------------------------------
 * 把"由 ASIN 拼出带联盟 tag 的 Amazon 商品链接"这件事收敛到一处，
 * 让 <AffiliateLink>（MDX 正文用）和 <VerdictBox>（结论卡用）共用同一套
 * 逻辑——避免任何地方再出现硬编码的 tag 或域名。
 *
 * 为什么单独抽出来：
 *   - tag 默认从环境变量读，全站只配一次（Vercel env）
 *   - 将来换区域域名 / 加 query 参数，只改这一个文件
 *   - 任何需要"buy 按钮"的组件都能复用，不用再拼裸 URL
 */

/** 支持的 Amazon 区域站点 —— 新增国家时在这里加一行即可 */
export type AmazonRegion =
  | 'com'      // 美国（默认）
  | 'co.uk'    // 英国
  | 'ca'       // 加拿大
  | 'de'       // 德国
  | 'fr'       // 法国
  | 'it'       // 意大利
  | 'es'       // 西班牙
  | 'co.jp'    // 日本
  | 'com.au';  // 澳大利亚

/**
 * 全局默认 Associates tag。
 * 未配置时为空串 —— 拼出的链接不带 tag（没佣金但不会 404）。
 * 注意：这是 NEXT_PUBLIC_ 前缀，构建期会被内联到客户端 bundle，
 * 因此 server / client 组件都能安全读取同一个值。
 */
export const DEFAULT_AMAZON_TAG =
  process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG ?? '';

/**
 * 由 ASIN 拼出 Amazon 商品链接（可选携带联盟 tag）。
 *
 * @param asin   10 位商品代码（商品 URL 里 /dp/ 后面那段）
 * @param region 区域站点，默认 com（美国）
 * @param tag    覆盖默认 tag；不传则用 DEFAULT_AMAZON_TAG（全局 env）
 * @returns      形如 https://www.amazon.com/dp/<ASIN>?tag=<TAG>
 */
export function buildAmazonUrl(
  asin: string,
  region: AmazonRegion = 'com',
  tag?: string,
): string {
  const effectiveTag = tag || DEFAULT_AMAZON_TAG;
  const tagQuery = effectiveTag
    ? `?tag=${encodeURIComponent(effectiveTag)}`
    : '';
  return `https://www.amazon.${region}/dp/${asin}${tagQuery}`;
}
