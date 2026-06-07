# YakRigged 关键词调研 Checklist（可重复执行）

> 一套**每月跑一遍**的关键词调研流程。目标：用最少时间，持续找到**低竞争、有意图、我们能赢**的长尾词，并决定写新文 / 改旧文 / 不做。
>
> 配套文档：选题落库见 [content-strategy.md](content-strategy.md)，写法见 [geo-content-guide.md](geo-content-guide.md)。
> 节奏红线：净新增**每周 ≤1–2 篇、匀速发**，别再一次性堆量（原因见记忆 `content-velocity-ai-spam-risk`）。

---

## 0. 心法（新站阶段必须记住）

- **低竞争 > 搜索量。** 新站别碰头部词（"fishing kayak"），专挑 3+ 词的长尾。
- **让 GSC 数据替你选题**，比拍脑袋准 10 倍 —— 所以 Track A 是主力。
- 优先选**我们能加"一手/社区视角"**的词（亲测、实拍、FB 群调研）—— 这是 AI 和大站抄不走的。
- 一个意图只写一页，**严禁同义词拆多页**（如 "pedal fishing kayak" = "fishing kayak with pedals" → 合并）。

---

## Track A · GSC 月度采集（站有曝光后的主力流程）⭐

> 前提：站上线被收录 ≥3–4 周，GSC Performance 有数据。每月初跑一次，~30 分钟。

1. ☐ 打开 **GSC → Performance → Search results**，时间选 **Last 3 months**，勾选 **Average position**。
2. ☐ 切到 **QUERIES** 标签 → 按 **Position** 排序，圈出 **position 8–30** 且 **Impressions > 50** 的词。
   - → 这些是"Google 已认为你相关、但还没排上去"的词，**最容易拿下**。每个都是候选长尾。
3. ☐ 找 **Impressions 高、CTR 异常低（<1%）** 的词：
   - 已有文章命中它 → **改标题/description**（不写新文）。
   - 没有对应文章 → **内容缺口**，写新文。
4. ☐ 切到 **PAGES** 标签 → 点曝光最高的几个页面 → 回到 QUERIES 看它实际命中哪些 query → 把这些 query 拆成**长尾子文**（spoke）。
5. ☐ 把所有候选词填进下方 **候选词清单** 表，进入第 3 步打分。

> 没数据/全新主题时，先用 Track B。

---

## Track B · 冷启动发现（无 GSC 数据 / 开拓新主题时）

挑 1 个种子词（如 `kayak fishing`、`fishing kayak`、`kayak paddle`），跑下面任意几个：

1. ☐ **Google 自动补全**：输入种子词 + 空格 + a/b/c... 看补全；记下问句型（how/what/is/best）。
2. ☐ **People Also Ask + 页面底部 Related searches**：直接抄真实长尾问句。
3. ☐ **Amazon 搜索框补全**：买家意图最强、最契合联盟（如 `kayak fishing ___` → crate / rod holder / anchor）。
4. ☐ **AnswerThePublic / AlsoAsked**：把种子词炸成几十个问句型长尾。
5. ☐ **Keyword Surfer（Chrome 插件）/ Ahrefs 免费 Keyword Generator**：拿个大概搜索量。
6. ☐ **FB 群 / Reddit**：反复被问的问题 = 长尾选题 + 一手素材（顺手按授权规则收集，见 `content-velocity-ai-spam-risk`）。
7. ☐ 用下面的**修饰词矩阵**批量裂变。

### 修饰词矩阵（从任意 hub 套用）

| 维度 | 模板 | 例子 |
|------|------|------|
| 鱼种 | best kayak for **[species]** fishing | bass / redfish / trout / crappie |
| 水域 | kayak fishing in **[water]** | saltwater / rivers / the ocean / lakes |
| 价位 | best fishing kayak **under $[N]** | under 500 / under 1000 |
| 场景 | **[use]** fishing kayak | stand up / offshore / whitewater |
| 对比 | **[A] vs [B]** | Hobie vs Old Town / sit-on-top vs sit-in |
| 问题型 | **is/how to** ... | is kayak fishing worth it / how to anchor a kayak |
| 人群 | ... for **[who]** | beginners / big guys / kids / seniors |

---

## 3. 打分筛选（每个候选词过一遍）

给每个候选词打 ✅/❌，**优先做 ✅ 多的**：

- ☐ **意图清晰**？（买家/信息意图明确，不是泛词）
- ☐ **低竞争**？（SERP 前排是不是全是 REI/大出版社？是 → 降级。有论坛/小站/老帖 → 机会）
- ☐ **有量**？（哪怕工具显示几十–几百/月也行，长尾贵在多和准）
- ☐ **能加一手/社区视角**？（能亲测/实拍/引用真实车主 → 加分）
- ☐ **有联盟/商业价值**？（能自然挂产品链接 → 对 affiliate 模式更值）
- ☐ **GSC 已有曝光**？（有 → 最高优先级，是"临门一脚"）

> 经验法则：**position 8–30 且能加一手视角的词，永远先做。**

---

## 4. 决策：写新文 / 改旧文 / 合并 / 放弃

```
这个词已有文章命中吗？
├─ 有，且排名 8–30        → 改旧文（补内容/改标题/加 FAQ），不写新文
├─ 有，但意图和现有文不同  → 写新 spoke，内链回 hub
├─ 没有，意图独立且能赢    → 写新文，挂到对应 cluster
└─ 和已有文/其他候选词同意图 → 合并成一页（防 cannibalization）
```

确认要写后：登记到 [content-strategy.md](content-strategy.md) 对应 cluster，再按 [geo-content-guide.md](geo-content-guide.md) 写。

---

## 5. 候选词清单（每月复制一份填写）

| 候选关键词 | 来源(GSC/补全/PAA/群) | GSC曝光 | GSC位置 | 意图 | 竞争(低/中/高) | 一手视角? | 决策(新/改/并/弃) | 对应hub |
|-----------|----------------------|--------|--------|------|--------------|----------|------------------|--------|
| | | | | | | | | |
| | | | | | | | | |

---

## 6. 免费工具清单

| 工具 | 用途 |
|------|------|
| **Google Search Console** | 主力：position 8–30、CTR 缺口、页面命中词 |
| Google 自动补全 / PAA / Related | 真实长尾 + 问句 |
| Amazon 搜索补全 | 买家意图长尾（最契合联盟）|
| AnswerThePublic / AlsoAsked | 问句型长尾批量 |
| Keyword Surfer / Ahrefs Free Keyword Generator | 粗略搜索量 |
| Google Trends | 验证趋势、对比词、找上升词 |
| Umami | 看哪些已发文章真有人读、停留 |

---

## 月度节奏总结

1. 月初：跑 **Track A**（30 分钟）→ 填候选词清单 → 打分。
2. 选出本月 **4–8 个** ✅ 最多的词。
3. 按**每周 1–2 篇**匀速产出（写新 or 改旧），登记进 content-strategy。
4. 持续：旧文跑出曝光的，回头补一手内容 + 刷新。
