# GEO (Generative Engine Optimization) 内容写作指南

> 让 YakRigged 的内容更容易被 ChatGPT、Perplexity、Google AI Overviews 等 AI 搜索引擎引用。

## 核心原则

AI 搜索引擎引用内容的逻辑和传统搜索不同：

| 传统 SEO | AI SEO (GEO) |
|----------|-------------|
| 排名第一页 | 被引用为来源 |
| 关键词密度 | 内容可提取性 |
| 反向链接 | 权威信号（数据、专家引用） |
| 页面停留时间 | 段落自包含性 |

## GEO 组件使用指南

### 1. `<KeyTakeaway>` — 关键结论块

**什么时候用**：每篇文章的核心结论、每个章节的总结。

**为什么有效**：AI 系统偏好 40-60 词的自包含段落作为引用片段。

```mdx
<KeyTakeaway>
  A 5-inch fish finder is the sweet spot for kayak anglers. Larger screens
  eat battery and deck space; smaller ones are unreadable at arm's length
  in direct sunlight. The Garmin Striker Vivid 5cv at $329 offers the best
  balance of screen quality and power efficiency.
</KeyTakeaway>
```

**规则**：
- 每篇文章至少 1 个，推荐 2-3 个
- 控制在 40-60 词
- 必须能脱离上下文独立理解
- 包含具体数据或结论，不要泛泛而谈

### 2. `<ExpertQuote>` — 专家引用块

**什么时候用**：测试结论、经验分享、专业判断。

**为什么有效**：带署名的专家引用让 AI 引用概率提升 ~30%。

```mdx
<ExpertQuote name="Marcus Reed" title="Lead Reviewer, YakRigged" source="Field testing, May 2026">
  After 40+ hours across three kayaks, the Garmin Striker Vivid 5cv was the
  only unit I could read without squinting at noon with polarized lenses on.
  That alone makes it worth the $130 premium over the Lowrance HOOK Reveal.
</ExpertQuote>
```

**规则**：
- 必须有真实的 name 和 title
- source 字段标注测试时间/条件
- 内容要有具体观点，不要空洞赞美

### 3. `<StatBlock>` — 数据统计块

**什么时候用**：测量数据、价格、性能指标。

**为什么有效**：带来源的统计数据让 AI 可见度提升 ~37-40%。

```mdx
<StatBlock value="800 nits" label="Garmin Striker Vivid 5cv peak brightness" source="Measured with lux meter" />
<StatBlock value="0.48A" label="average power draw at 50% brightness" source="Clamp meter, 7hr test" />
<StatBlock value="$329" label="street price as of May 2026" source="Amazon US" />
```

## 内容结构最佳实践

### 1. 每篇文章开头直接回答

❌ 不要：
```
Fish finders have become increasingly popular among kayak anglers in recent years...
```

✅ 要：
```
The best fish finder for most kayak anglers in 2026 is the Garmin Striker Vivid 5cv ($329).
It offers the best combination of sunlight readability, battery efficiency, and sonar quality
in a 5-inch package.
```

### 2. H2/H3 标题匹配搜索意图

用户怎么问，标题就怎么写：

- ❌ `## Our Testing Process`
- ✅ `## How we tested these fish finders`

- ❌ `## Battery Considerations`
- ✅ `## How big a battery do I need for a kayak fish finder?`

### 3. 比较内容用表格

AI 系统从表格提取结构化数据的效率远高于段落：

```mdx
| Feature | Garmin Striker Vivid 5cv | Lowrance HOOK Reveal 5 |
|---------|------------------------|----------------------|
| Screen brightness | 800 nits | 500 nits |
| Power draw | 0.48A | 0.52A |
| Price | $329 | $199 |
| GPS | ✅ Built-in | ✅ Built-in |
| Side imaging | ❌ | ❌ |
```

### 4. FAQ 必须自然语言

FAQ 的 `q` 字段要用完整的自然语言问句（这是用户对 AI 说话的方式）：

- ❌ `q: "Battery size"`
- ✅ `q: "How big a battery do I actually need for a kayak fish finder?"`

### 5. 保持内容新鲜

- 每篇文章必须有 `pubDate`
- 价格/规格变化时更新 `updatedDate`
- 标题含年份（如 "Best Fish Finders for Kayaks in 2026"）
- 文中引用数据标注日期

## Frontmatter 最佳实践（GEO 视角）

```yaml
---
title: "Best Fish Finders for Kayaks in 2026: Field-Tested Picks"  # 含年份 + 权威信号
description: "We rigged six popular fish finders to three different kayaks and spent 40+ hours on the water."  # 具体数据
pubDate: 2026-05-12
updatedDate: 2026-05-20  # 保持更新
category: reviews
tags: [fish-finder, electronics, garmin, lowrance]  # 具体品牌/产品名
author: Marcus Reed  # 真实署名
review:
  productName: "Garmin Striker Vivid 5cv"
  brand: Garmin
  rating: 4.5
  price: { currency: USD, amount: 329 }
faq:  # 至少 3-5 个自然语言问答
  - q: "How big a battery do I actually need for a kayak fish finder?"
    a: "For a 5-inch unit on a day trip, a 7Ah sealed lead-acid battery is plenty..."
---
```

## 检查清单

写完每篇文章后对照：

- [ ] 第一段直接回答核心问题（不超过 2 句）
- [ ] 至少 1 个 `<KeyTakeaway>` 块
- [ ] 评测文章有 `<ExpertQuote>` 带署名
- [ ] 关键数据用 `<StatBlock>` 标注来源
- [ ] 比较内容用 markdown 表格
- [ ] H2 标题匹配用户搜索意图
- [ ] FAQ 有 3-5 个自然语言问答
- [ ] `updatedDate` 是最近 6 个月内
- [ ] description 包含具体数据（不是泛泛的营销语）
