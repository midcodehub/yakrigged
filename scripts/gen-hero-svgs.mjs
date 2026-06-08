/**
 * gen-hero-svgs.mjs —— 为缺 hero 图的文章批量生成"高端户外杂志风"模板 SVG
 * --------------------------------------------------------------------------
 * 与现有 public/blog/*.svg 同一套视觉语言（1200×675、深→teal 渐变、底部水波线、
 * 右侧低透明 motif、橙色 tick、YAKRIGGED·类别 eyebrow、双行大标题含橙 accent 词、
 * 副标题）。这些 hero 是自包含图片，用系统 Arial，不依赖站点 webfont。
 *
 * 运行：node scripts/gen-hero-svgs.mjs
 *   1. 写 public/blog/<slug>.svg
 *   2. 给 content/blog/<slug>.mdx 的 frontmatter 补 heroImage / heroImageAlt（若缺）
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** 右侧低透明 motif（cream #d6efe9）—— 按主题选用 */
const MOTIFS = {
  screen: `<g transform="translate(885,360)" opacity="0.17" fill="none" stroke="#d6efe9" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <rect x="-155" y="-115" width="310" height="230" rx="20"/>
    <path d="M-120 50 Q -40 -25 35 35 T 120 12"/>
    <circle cx="35" cy="-18" r="11" fill="#d6efe9" stroke="none"/>
  </g>`,
  glare: `<g transform="translate(885,360)" opacity="0.17" fill="none" stroke="#d6efe9" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <rect x="-150" y="-100" width="300" height="210" rx="20"/>
    <path d="M-115 55 Q -35 -15 40 40 T 120 18"/>
    <g stroke-width="9"><circle cx="120" cy="-118" r="26"/>
    <line x1="120" y1="-165" x2="120" y2="-150"/><line x1="120" y1="-86" x2="120" y2="-71"/>
    <line x1="73" y1="-118" x2="88" y2="-118"/><line x1="152" y1="-118" x2="167" y2="-118"/>
    <line x1="87" y1="-151" x2="98" y2="-140"/><line x1="142" y1="-96" x2="153" y2="-85"/></g>
  </g>`,
  transducer: `<g transform="translate(905,350)" opacity="0.17">
    <line x1="-130" y1="-130" x2="35" y2="55" stroke="#d6efe9" stroke-width="13" stroke-linecap="round"/>
    <ellipse cx="55" cy="80" rx="70" ry="30" fill="#d6efe9"/>
    <line x1="55" y1="80" x2="55" y2="130" stroke="#d6efe9" stroke-width="9" stroke-linecap="round"/>
  </g>`,
  battery: `<g transform="translate(890,360)" opacity="0.17" fill="none" stroke="#d6efe9" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <rect x="-135" y="-78" width="270" height="156" rx="16"/>
    <rect x="-78" y="-104" width="42" height="28" rx="7" fill="#d6efe9" stroke="none"/>
    <rect x="36" y="-104" width="42" height="28" rx="7" fill="#d6efe9" stroke="none"/>
    <path d="M-8 -34 L 28 -34 L -6 16 L 30 16" stroke-width="11"/>
  </g>`,
  box: `<g transform="translate(895,360)" opacity="0.17" fill="none" stroke="#d6efe9" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <rect x="-125" y="-68" width="250" height="158" rx="14"/>
    <line x1="-125" y1="-14" x2="125" y2="-14"/>
    <rect x="-28" y="-92" width="56" height="28" rx="9" fill="#d6efe9" stroke="none"/>
  </g>`,
  rod: `<g transform="translate(905,300) rotate(-30)" opacity="0.16" fill="none" stroke="#d6efe9" stroke-width="6">
    <rect x="-300" y="-7" width="600" height="14" rx="7" fill="#d6efe9" stroke="none"/>
    <circle cx="305" cy="0" r="15" fill="#d6efe9" stroke="none"/>
    <circle cx="-150" cy="0" r="22"/><circle cx="-60" cy="0" r="17"/><circle cx="20" cy="0" r="13"/>
  </g>`,
  cable: `<g transform="translate(880,355)" opacity="0.17">
    <path d="M-165 -85 C -35 -125, -45 45, 80 5 S 175 80, 150 105" fill="none" stroke="#d6efe9" stroke-width="13" stroke-linecap="round"/>
    <rect x="128" y="86" width="54" height="36" rx="8" fill="#d6efe9"/>
  </g>`,
  kayak: `<g transform="translate(880,420)" opacity="0.2">
    <path d="M-250 0 q 34 -40 250 -40 q 216 0 250 40 q -34 40 -250 40 q -216 0 -250 -40 z" fill="#d6efe9"/>
    <rect x="-40" y="-20" width="80" height="14" rx="7" fill="#0f3833" fill-opacity="0.55"/>
    <ellipse cx="0" cy="-2" rx="26" ry="14" fill="#0f3833" fill-opacity="0.35"/>
  </g>`,
};

function buildSvg(h) {
  const l2 = `${h.l2pre ? esc(h.l2pre) : ''}<tspan fill="#f08a3e">${esc(h.l2accent)}</tspan>${h.l2post ? esc(h.l2post) : ''}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675" role="img" aria-label="${esc(h.alt)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1220"/>
      <stop offset="0.55" stop-color="#144841"/>
      <stop offset="1" stop-color="#1f7065"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <g stroke="#2d8c7c" stroke-opacity="0.3" stroke-width="2.5" fill="none">
    <path d="M0 600 Q 300 575 600 600 T 1200 600"/>
    <path d="M0 635 Q 300 612 600 635 T 1200 635"/>
  </g>
  ${MOTIFS[h.motif]}
  <rect x="80" y="158" width="70" height="9" rx="4.5" fill="#f08a3e"/>
  <text x="80" y="138" font-family="Arial, Helvetica, sans-serif" font-size="27" letter-spacing="5" font-weight="700" fill="#aedfd3">YAKRIGGED · ${esc(h.eyebrow)}</text>
  <text x="78" y="298" font-family="Arial, Helvetica, sans-serif" font-size="${h.fs}" font-weight="800" fill="#ffffff">${esc(h.l1)}</text>
  <text x="78" y="${298 + Math.round(h.fs * 1.12)}" font-family="Arial, Helvetica, sans-serif" font-size="${h.fs}" font-weight="800" fill="#ffffff">${l2}</text>
  <text x="80" y="${298 + Math.round(h.fs * 1.12) + 70}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="500" fill="#d6efe9">${esc(h.sub)}</text>
</svg>
`;
}

/** 在 frontmatter 的 category: 行后插入 heroImage / heroImageAlt（若尚无）*/
function patchFrontmatter(slug, alt) {
  const mdxPath = path.join(ROOT, 'content', 'blog', `${slug}.mdx`);
  let src = fs.readFileSync(mdxPath, 'utf8');
  if (/^heroImage:/m.test(src)) return 'skip (已有 heroImage)';
  const lines = src.split('\n');
  const catIdx = lines.findIndex((l) => /^category:/.test(l));
  if (catIdx === -1) throw new Error(`${slug}: 找不到 category 行`);
  lines.splice(
    catIdx + 1,
    0,
    `heroImage: /blog/${slug}.svg`,
    `heroImageAlt: "${alt}"`,
  );
  fs.writeFileSync(mdxPath, lines.join('\n'));
  return 'patched';
}

const heroes = [
  { slug: 'best-fish-finders-for-kayaks-2026', eyebrow: "BUYER'S GUIDE", l1: 'Best Fish Finders', l2pre: 'for Kayaks ', l2accent: '2026', sub: 'Field-tested picks for every budget', motif: 'screen', fs: 78, alt: 'Best fish finders for kayaks 2026 — YakRigged field-tested buyer guide cover' },
  { slug: 'best-no-drill-transducer-mount-for-kayaks', eyebrow: "BUYER'S GUIDE", l1: 'Best No-Drill', l2pre: 'Transducer ', l2accent: 'Mounts', sub: 'Mount it without drilling your hull', motif: 'transducer', fs: 82, alt: 'Best no-drill transducer mounts for kayaks — YakRigged buyer guide cover' },
  { slug: 'diy-waterproof-kayak-electronics-box', eyebrow: 'DIY BUILD', l1: 'DIY Waterproof', l2pre: 'Electronics ', l2accent: 'Box', sub: 'A $40 weekend build that lasts a season', motif: 'box', fs: 82, alt: 'DIY waterproof kayak electronics box — YakRigged weekend build cover' },
  { slug: 'how-to-rig-rod-holders', eyebrow: 'INSTALL GUIDE', l1: 'How to Rig', l2pre: 'Rod ', l2accent: 'Holders', sub: 'Flush-mount install without hull damage', motif: 'rod', fs: 88, alt: 'How to rig flush-mount rod holders on a kayak — YakRigged install guide cover' },
  { slug: 'best-lifepo4-battery-for-garmin-livescope-kayak', eyebrow: "BUYER'S GUIDE", l1: 'Best LiFePO4', l2pre: 'for ', l2accent: 'LiveScope', sub: 'All-day kayak power, sized right', motif: 'battery', fs: 84, alt: 'Best LiFePO4 battery for Garmin LiveScope on a kayak — YakRigged buyer guide cover' },
  { slug: 'can-you-mount-a-fish-finder-transducer-inside-a-kayak', eyebrow: 'HOW-TO GUIDE', l1: 'Transducer', l2pre: 'Inside the ', l2accent: 'Hull?', sub: 'Shoot-through-hull: when it works', motif: 'transducer', fs: 86, alt: 'Mounting a fish finder transducer inside a kayak hull — YakRigged how-to guide cover' },
  { slug: 'how-to-mount-a-transducer-on-a-sit-on-top-kayak', eyebrow: 'INSTALL GUIDE', l1: 'No-Drill', l2pre: 'Transducer ', l2accent: 'Mount', sub: 'On a sit-on-top, zero holes', motif: 'transducer', fs: 86, alt: 'No-drill transducer mount on a sit-on-top kayak — YakRigged install guide cover' },
  { slug: 'how-to-fix-fish-finder-screen-glare-on-kayak', eyebrow: 'HOW-TO GUIDE', l1: 'Fix Fish Finder', l2pre: 'Screen ', l2accent: 'Glare', sub: '7 fixes ranked, $0 to $30', motif: 'glare', fs: 80, alt: 'How to fix fish finder screen glare on a kayak — YakRigged how-to guide cover' },
  { slug: 'kayak-fish-finder-setup-complete-guide', eyebrow: 'COMPLETE GUIDE', l1: 'Fish Finder', l2pre: 'Setup ', l2accent: 'Guide', sub: 'Bare hull to fully-rigged in a weekend', motif: 'screen', fs: 88, alt: 'Kayak fish finder setup complete guide — YakRigged cover' },
  { slug: 'how-to-run-wires-in-a-kayak-for-a-fish-finder', eyebrow: 'HOW-TO GUIDE', l1: 'Run Wires', l2pre: 'Without ', l2accent: 'Leaks', sub: 'Clean cable routing for electronics', motif: 'cable', fs: 88, alt: 'How to run wires in a kayak for a fish finder — YakRigged how-to guide cover' },
  { slug: 'welcome', eyebrow: 'HELLO', l1: 'Welcome to', l2accent: 'YakRigged', sub: 'Field-tested kayak fishing gear and rigs', motif: 'kayak', fs: 90, alt: 'Welcome to YakRigged — kayak fishing gear reviews and rigs' },
];

for (const h of heroes) {
  fs.writeFileSync(path.join(ROOT, 'public', 'blog', `${h.slug}.svg`), buildSvg(h));
  const status = patchFrontmatter(h.slug, h.alt);
  console.log(`✓ ${h.slug}.svg  | frontmatter: ${status}`);
}
console.log(`\n生成完成：${heroes.length} 张 hero SVG`);
