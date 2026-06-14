/**
 * 敏感词黑名单 + 外链检测
 * --------------------------------------------------
 * 审核决策树(见 moderation.ts)的两个判定器都在这里:
 *   1. 命中敏感词 → 直接拒
 *   2. 含外链     → 进审核队列
 *
 * 维护方式:直接改下面的数组,版本可控、随时加词。不放 env。
 * 词表故意保持"代表性 + 易扩充",不是穷举。按你站点实际遇到的垃圾再补。
 */

/**
 * 敏感词(小写匹配)。覆盖:黄(成人)/赌(博彩)/毒(药物)/常见垃圾推广。
 * 注意:用"包含"匹配,留意误杀(如 "class" 含 "ass")—— 已尽量用较长的词根。
 */
const SENSITIVE_WORDS: string[] = [
  // 成人 / 色情
  'porn', 'xxx', 'nsfw', 'sex cam', 'escort', 'onlyfans', 'nude pics',
  // 博彩
  'casino', 'betting', 'poker online', 'slot machine', '赌博', '博彩', '老虎机',
  // 药物 / 处方
  'viagra', 'cialis', 'cannabis for sale', 'buy weed', '迷药', '走私',
  // 垃圾推广 / 诈骗常见词
  'make money fast', 'work from home guaranteed', 'crypto giveaway',
  'forex signals', 'binary options', 'free followers', 'cheap rolex',
  'loan approval guaranteed', '加微信', '免费领取', '一键开户',
];

/**
 * 外链检测:匹配 http(s):// 或裸域名(含 www. 或 xxx.com/net/...)。
 * 设计目标是"宁可多报",外链一律进人审队列。
 */
const URL_REGEX =
  /\b(?:https?:\/\/|www\.)[^\s]+|\b[a-z0-9-]+\.(?:com|net|org|io|co|info|biz|xyz|shop|store|ru|cn)\b/i;

/** 命中敏感词返回该词,否则返回 null */
export function findSensitiveWord(text: string): string | null {
  const lower = text.toLowerCase();
  for (const word of SENSITIVE_WORDS) {
    if (lower.includes(word.toLowerCase())) return word;
  }
  return null;
}

/** 是否包含外链 */
export function hasExternalLink(text: string): boolean {
  return URL_REGEX.test(text);
}
