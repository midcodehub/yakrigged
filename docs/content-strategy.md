# YakRigged Content Strategy: Topic Clusters

> 基于 Hub & Spoke 模型的内容规划框架。每个 cluster 有一个 hub（综合指南）和多个 spoke（深度子话题），通过内链形成权重传递网络。

---

## 当前 Cluster 状态

### Cluster 1: Kayak Fish Finder Setup ✅ (已建立)

**Hub**: `/blog/kayak-fish-finder-setup-complete-guide`

| Spoke | Status | Slug |
|-------|--------|------|
| Best fish finders for kayaks | ✅ | `best-fish-finders-for-kayaks-2026` |
| Transducer mount (no-drill) | ✅ | `best-no-drill-transducer-mount-for-kayaks` |
| Mount transducer inside hull | ✅ | `can-you-mount-a-fish-finder-transducer-inside-a-kayak` |
| LiFePO4 battery for LiveScope | ✅ | `best-lifepo4-battery-for-garmin-livescope-kayak` |
| Waterproof electronics box | ✅ | `diy-waterproof-kayak-electronics-box` |
| Wire routing | ✅ | `how-to-run-wires-in-a-kayak-for-a-fish-finder` |
| Screen glare fix | ✅ | `how-to-fix-fish-finder-screen-glare-on-kayak` |

**内链规则**: Hub 链到所有 spoke，每个 spoke 链回 hub + 相邻 spoke。

---

## 规划中的 Clusters

### Cluster 2: Kayak Rigging & Accessories

**Hub (待写)**: "How to Rig a Fishing Kayak: The Complete Setup Guide"
- Slug: `how-to-rig-a-fishing-kayak-complete-guide`
- 目标关键词: "how to rig a fishing kayak", "kayak fishing setup"

| Spoke | Priority | Target Keyword |
|-------|----------|---------------|
| Rod holders (已有) | ✅ | "flush mount rod holders kayak" |
| Anchor trolley install | 🔴 High | "kayak anchor trolley" |
| Crate & milk crate rigging | 🔴 High | "kayak fishing crate setup" |
| Paddle holder options | 🟡 Med | "kayak paddle holder" |
| Kayak seat upgrade | 🟡 Med | "best kayak fishing seat" |
| DIY kayak cart | 🟢 Low | "diy kayak cart" |
| Kayak lighting (night fishing) | 🟢 Low | "kayak navigation lights" |

### Cluster 3: Kayak Safety & PFDs

**Hub (待写)**: "Kayak Fishing Safety: PFDs, Gear & Rules You Need to Know"
- Slug: `kayak-fishing-safety-guide`
- 目标关键词: "kayak fishing safety", "best PFD for kayak fishing"

| Spoke | Priority | Target Keyword |
|-------|----------|---------------|
| Best PFDs for kayak fishing | ✅ `best-pfds-for-kayak-fishing` | "best life jacket kayak fishing" — 研究型 roundup,回链 pillar |
| Kayak stability & self-rescue | 🔴 High | "kayak self rescue technique" |
| Cold water kayak fishing gear | 🟡 Med | "cold water kayak fishing" |
| Kayak fishing in wind/current | 🟡 Med | "kayak fishing windy conditions" |
| Kayak visibility gear | 🟢 Low | "kayak safety flag" |

### Cluster 4: Kayak Fishing (站级 Pillar) ✅ (Hub 已建立)

> "kayak fishing" 是超级头部词，单页吃不下。打法是建**站级 beginner pillar** 吃长尾(for beginners / tips / is it safe / gear / cost)，往下内链鱼探 + 船桨等所有 cluster,靠主题覆盖完整度连带渗透头部词。首页 Hero 已加 root 级内链指向 pillar。

**Hub**: `/blog/kayak-fishing-for-beginners` ("Kayak Fishing for Beginners: The Complete Guide")
- 目标关键词: "kayak fishing for beginners", "how to start kayak fishing", "kayak fishing tips", "is kayak fishing safe", "kayak fishing gear/cost"
- 内链下钻: 船桨 cluster (paddles/sizing/fishing paddles) + 鱼探 cluster (setup hub/best fish finders/DIY box) + rod holders
- 反向链接: best-kayak-paddles、best-kayak-fishing-paddles 已回链 pillar

**Spoke (待写，pillar 内已内联讲透，暂不留死链)**: 详见下方原 techniques/safety 子话题

| Spoke | Priority | Target Keyword |
|-------|----------|---------------|
| Trolling from a kayak | 🔴 High | "how to troll from a kayak" |
| Anchoring techniques | 🔴 High | "how to anchor a kayak for fishing" |
| Sight fishing from kayak | 🟡 Med | "sight fishing kayak" |
| Kayak fly fishing setup | 🟡 Med | "fly fishing from kayak" |
| Landing big fish from kayak | 🟡 Med | "landing fish from kayak" |
| Kayak fishing in current | 🟢 Low | "river kayak fishing tips" |

### Cluster 5: Best Kayaks for Fishing (Comparison)

**Hub**: `/blog/best-fishing-kayaks` ✅ (已建立)
- 目标关键词: "best fishing kayak", "fishing kayak reviews", "best fishing kayaks 2026"
- 6 款真实 ASIN(Perception/Lifetime/Vibe/Old Town×2/Pelican),研究型 roundup
- 全站内链枢纽: 内链船桨 + PFD + 鱼探 cluster + rod holders + pillar; pillar 选船小节已回链本 Hub

| Spoke | Priority | Target Keyword |
|-------|----------|---------------|
| Best pedal kayaks for fishing | 🔴 High | "best pedal fishing kayak" |
| Best budget fishing kayaks | 🔴 High | "best fishing kayak under 1000" |
| Sit-on-top vs sit-in for fishing | 🟡 Med | "sit on top vs sit in kayak fishing" |
| Best tandem fishing kayaks | 🟡 Med | "best tandem fishing kayak" |
| Inflatable fishing kayaks | 🟢 Low | "inflatable fishing kayak review" |

### Cluster 6: Kayak Paddles 🟡 (Hub 已建立)

> 关键词意图分析：best / top / top rated / best rated / reviews 这 6 个变体 Google 判为**同一意图**，由单一 Hub 通吃，**严禁拆成多页**（会 cannibalize）。"for sale / near me" 是零售/本地意图，内容站吃不到，仅靠 Hub 的 "Where to buy" 小节连带承接。编辑视角用**钓鱼桨权威**切入做差异化。数据为**研究型 roundup**（非亲测，文中已显式标注方法论，与全站"field-tested"口径区分）。

**Hub**: `/blog/best-kayak-paddles`
- 目标关键词: "best kayak paddles", "top rated kayak paddles", "best rated kayak paddles", "kayak paddles reviews", "top kayak paddles", "kayak paddles"(连带)

| Spoke | Status | Priority | Target Keyword |
|-------|--------|----------|---------------|
| Best Kayak Paddles (买家指南) | ✅ Hub | — | "best/top/top rated kayak paddles" |
| What size kayak paddle do I need (尺寸指南) | ✅ | 🔴 High | "what size kayak paddle" — 信息型,引流+反链利器,AI 爱引用 |
| Best kids kayak paddles (细分人群) | ✅ | 🟡 Med | "kids kayak paddles" — 竞争低 |
| Best kayak fishing paddles (绑定钓鱼权威) | ✅ | 🟢 Low | "best kayak fishing paddle" |

**内链规则**: Hub 链到现有 rod holders / fish finder hub;待写的尺寸指南与 kids 桨需链回本 Hub。

---

## 内容优先级矩阵

按 **搜索量 × 竞争难度 × 商业价值** 排序：

| 优先级 | 文章 | 理由 |
|--------|------|------|
| 1 | Cluster 2 Hub (rigging guide) | 高搜索量 + 已有 spoke 可链接 |
| 2 | Best PFDs for kayak fishing | 高商业价值（affiliate）+ 低竞争 |
| 3 | Anchor trolley install | 高搜索量 + 实操内容 AI 爱引用 |
| 4 | Cluster 5 Hub (best kayaks) | 极高搜索量但竞争激烈 |
| 5 | Trolling from a kayak | 技巧类内容 AI 引用率高 |

---

## 内容模板

### Review 文章模板

```mdx
---
title: "Best [Product] for Kayak Fishing in [Year]: Field-Tested"
description: "We tested [N] [products] on [N] kayaks over [N] hours. Here are our picks."
category: reviews
review:
  productName: "[Winner]"
  brand: "[Brand]"
  rating: [N]
  price: { currency: USD, amount: [N] }
faq:
  - q: "[Natural language question]?"
    a: "[40-60 word answer with specific data]"
---

<AffiliateDisclosure />

<VerdictBox productName="..." rating={N} bestFor="..." skipIf="..." price="..." buyUrl="..." />

<KeyTakeaway>
[40-60 word core conclusion with specific data point]
</KeyTakeaway>

## TL;DR — Our top picks

| Use case | Winner | Why |
| --- | --- | --- |
| Best overall | ... | ... |
| Best budget | ... | ... |
| Best for [specific use] | ... | ... |

## How we tested

<StatBlock value="[N] hours" label="total on-water testing time" source="[Month Year]" />

[Testing methodology paragraph]

## 1. [Winner] — our pick

<ExpertQuote name="[Author]" title="[Title], YakRigged" source="Field testing, [Month Year]">
[Specific observation with data]
</ExpertQuote>

[Detailed review...]
```

### How-To Guide 模板

```mdx
---
title: "How to [Action]: Step-by-Step Guide for Kayak Anglers"
description: "A step-by-step guide to [action] — [specific detail] — with [credibility signal]."
category: guides
faq:
  - q: "[Question phrased as user would ask AI]?"
    a: "[Self-contained answer]"
---

<KeyTakeaway>
[Core answer to the "how to" question in 40-60 words]
</KeyTakeaway>

## What you'll need

[Materials/tools list]

## Step 1 — [Action verb + object]

[Instructions with specific measurements/data]

<StatBlock value="[measurement]" label="[what it measures]" source="[how measured]" />

## Step 2 — [Action verb + object]

...

## Common mistakes

[Numbered list of pitfalls]

## FAQ

[Rendered from frontmatter faq array]
```

---

## 发布节奏建议

| 频率 | 内容类型 | 目标 |
|------|---------|------|
| 每周 1 篇 | Spoke 文章 | 填充 cluster，积累长尾流量 |
| 每月 1 篇 | Hub 综合指南 | 建立主题权威 |
| 每季度 | 更新已有 hub | 保持 freshness 信号 |
| 持续 | 给旧文章加 GEO 组件 | 提升 AI 引用率 |

---

## 下一步行动

1. ✍️ 写 Cluster 2 Hub（rigging guide）— 链接已有的 rod holders spoke
2. ✍️ 写 "Best PFDs for Kayak Fishing" — 高 affiliate 价值
3. 🔄 给现有 10 篇文章补充 `<KeyTakeaway>` 和 `<ExpertQuote>` 组件
4. 📊 设置 Google Search Console 监控 AI Overview 出现率
5. 🔗 确保每篇新文章至少链接 2 篇站内文章 + 被 hub 链接
