---
title: Web3 安全赚钱的 5 条路径：门槛、收益与真实差距
title_en: '5 Ways to Earn in Web3 Security: Barriers, Payouts and the Real Gap'
date: 2026-10-15 19:00:00
categories:
  - [加密行业, web3转型]
categories_en:
  - [Crypto Industry, Web3 Transition]
tags:
  - Web3 安全
  - 白帽黑客
  - 漏洞赏金
  - 审计竞赛
  - 智能合约
  - 职业路径
tags_en:
  - Web3 Security
  - White Hat
  - Bug Bounty
  - Audit Contest
  - Smart Contracts
  - Career Path
cover: /_attach/crypto-industry/web3-transition/2026-10-15-web3-career-paths-cover.jpg
thumbnail: /_attach/crypto-industry/web3-transition/2026-10-15-web3-career-paths-cover.jpg
---

<div class="lang-block" data-lang="zh-CN" lang="zh-CN">

上一篇文章拆了 Immunefi 的机制，但没回答一个更实际的问题：**普通人怎么从 Web3 安全里赚到钱？**

搜索过程中我把这个生态摊开看了一遍，发现最常见的误解是把所有平台当成同一类。实际上门槛和收益结构差别极大——审计竞赛里新手几千美元能拿到手，漏洞赏金里一个 Critical 漏洞可能直接七位数；而审计服务的收入结构和前两者完全不同。

本文把 Web3 安全的 5 条变现路径摊开对比，附上可核实的门槛与收益区间。**收益数字来自公开资料与平台公开数据，不是收入承诺**——真实收入高度依赖能力、运气与市场周期。

<!-- more -->

## 路径 1：漏洞赏金（Bug Bounty）

### 怎么运作

代码已上线，长期有效，任何时候发现漏洞都能提交。按严重性分级（Critical / High / Medium / Low）付酬，**单人独享全额**。

### 门槛与收益

| 维度 | 情况 |
| --- | --- |
| 上手门槛 | **最高**——需要找到真实可利用的漏洞 |
| 单次收益 | Critical 级可达 6 位数以上，个别案例达 1000 万美元级 |
| 收益确定性 | **最低**——可能投入数月颗粒无收 |
| 适合人群 | 有扎实功底、能读懂复杂合约逻辑的人 |

公开案例里有白帽因一个漏洞避免 4 亿美元损失、获得 1000 万美元赏金（约 40 倍 ROI）的记录。但这类案例是**尾部**，不是中位数。

### 代表平台

| 平台 | 特点 |
| --- | --- |
| **Immunefi** | 规模最大，35,000+ 研究人员，覆盖 330+ 项目 |
| **HackerOne** | 传统通用平台，Web3 只是其中一个板块 |
| **Intigriti** | 有 Web3 专项计划 |
| **BugRap** | 规模较小，主打亚洲项目 |

### 现实提示

- **PoC 共识机制**：白帽只写演示代码，不实际触发攻击。这保护了项目方，也避免了白帽踩线。
- **白帽行为边界仍模糊**：即便有 Safe Harbor（最高可拿 60% 赏金做资金救援），不同司法辖区对"善意"的认定并不一致。
- **大部分人赚不到钱**：这是典型的幂律结构，头部白帽占据绝大部分收益。

## 路径 2：审计竞赛（Audit Contest）

### 怎么运作

这是我最想强调的一条——**它才是普通人的入口**。

代码还没上线，项目方公开审计需求并设固定奖池，全球安全人员同时看同一份代码，**发现的问题按价值瓜分奖池**。

| 维度 | 情况 |
| --- | --- |
| 上手门槛 | **最低**——有基础审计能力就能参与 |
| 单次收益 | 奖池 2.5 万 ~ 50 万美元+，但**多人瓜分** |
| 收益确定性 | **较高**——只要提交有效发现就有回报 |
| 适合人群 | 刚入门、想积累实战记录的人 |

### 代表平台

| 平台 | 特点 | 平台费 |
| --- | --- | --- |
| **Code4rena** | 2021 年创立，去中心化开放组织 | 2025 年 6 月起**零平台费** |
| **Sherlock** | 以"争分"为核心，仓库审计历史公开可查 | 10-20% |
| **Cantina** | 覆盖最广（Web3 + 传统安全） | 10-20% |
| **CodeHawks** | 新兴，规模较小 | — |
| **Secure3** | 早期平台 | — |

> ⚠️ **Code4rena 的归属变化**：该平台已于 2024 年 8 月 22 日被 Zellic 收购。Zellic 靠传统审计业务盈利，Code4rena 转为人才管道与营销入口。**收费政策在收购后是否稳定，建议直接查官网确认**——网上流传的"零平台费"是收购前后某一时点的状态。

### 为什么这是新手的最佳起点

1. **不影响后续在 Immunefi 赚钱**——审计竞赛的公开记录本身就是资历证明
2. **收益可预期**——提交有效发现就有回报，不依赖中彩票
3. **同一份代码多人竞争**——能直观看到别人发现了什么，反馈密度高
4. **奖池透明**——项目方预先锁定，不存在赖账风险

## 路径 3：审计服务（Auditing Service）

### 怎么运作

项目方主动委托，签合同、按项目收费。这是**卖时间**而非卖运气。

| 维度 | 情况 |
| --- | --- |
| 上手门槛 | **高**——需要能被市场认可的品牌背书 |
| 收入结构 | 按项目/按天计价，比竞赛稳定得多 |
| 上限 | 取决于个人品牌与团队规模，不存在"一夜暴富" |
| 适合人群 | 已有战绩、希望转做自由职业的人 |

### 价格说明

我**没有找到可信的公开统一价目表**。搜索到的报价页多是"联系我们获取报价"，且部分站点已转向代币支付（如用原生代币支付可折半）。

行业里流传的经验区间（**未经权威来源确认，仅供参考**）：

- 小型合约（单一 token、非核心逻辑）：数千美元起
- 中型 DeFi 协议（多合约、有资金池）：数万美元
- 大型协议（L2、跨链桥）：十万美元级

### 一个反向的评估视角

从项目方角度，有第三方审计榜单可查排名——比如 smartcontractaudit.com 的排名逻辑是**先按"审计后是否被黑"排序，再按用户评分**。这意味着：

> **一个"零事故"的审计记录，比十份五星好评更有价值。**

想长期接单，先在公开榜单上留名。

## 路径 4：CTF 与实战训练

### 这条路径不直接赚钱，但决定前三条的上限

我把它单列出来，因为它常被误认为"只是练手"。实际上，**CTF 战绩是前三条路径的入场券**。

### 主流训练平台

| 平台 | 定位 |
| --- | --- |
| **Ethernaut** | 入门首选，以 Web2 背景开发者为目标，逐关理解攻击面 |
| **Damn Vulnerable DeFi** | 经典漏洞靶场，练攻击性安全与审计技能 |
| **Capture the Ether** | 以 DeFi 为主题的闯关式训练 |
| **Mr Steal Yo Crypto** | 中等难度，专攻权限与资产转移类漏洞 |
| **RareSkills Solidity Riddles** | Solidity 专项谜题 |
| **Paradigm CTF** | 进阶赛题，难度显著更高 |
| **Blocksec CTFs** | 汇总平台，入门到进阶都有 |

### 阶梯式建议

| 水平 | 建议路径 |
| --- | --- |
| 入门 | Ethernaut 或 Capture the Ether |
| 进阶 | Damn Vulnerable DeFi 或 Mr Steal Yo Crypto |
| 高级 | Paradigm CTF 或 Numen 类赛事 |

**关键点**：这些平台全部免费，且 Solidity 基础语法门槛不高。**先用 Ethernaut 打完再碰审计竞赛，成功率会高一个量级。**

## 路径 5：内容与教学

### 为什么值得单列

前四条都是"用技术换钱"，这条是**用表达能力换钱**，且和前四条不冲突。

| 形式 | 说明 |
| --- | --- |
| 技术博客 | 漏洞复盘、审计方法论——同时也是个人品牌 |
| 视频课程 | Hooked Academy、RareSkills、Smart Contract Security 都有体系化课程 |
| 企业培训 | 内训、公开课，面向开发团队的 Solidity 安全 |
| 研究报告 | 漏洞分析、攻击手法演进报告 |

### 现实门槛

- **纯靠流量变现很难**：需要长期积累
- **但技术博主的转化路径清晰**：写漏洞分析 → 建立信任 → 承接审计/咨询/课程
- **与前四条形成飞轮**：做审计的过程本身就在生产教学素材

## 五条路径横向对比

| 路径 | 上手门槛 | 收益确定性 | 收益上限 | 打赏/竞赛参与 |
| --- | --- | --- | --- | --- |
| 漏洞赏金 | 最高 | 最低 | 最高（幂律） | 无参与成本 |
| 审计竞赛 | 最低 | 较高 | 中（受奖池限制） | 需投入时间 |
| 审计服务 | 高 | 高 | 中（受品牌限制） | 需口碑背书 |
| CTF 训练 | 低 | 无直接收益 | — | 全部免费 |
| 内容教学 | 中 | 中 | 中 | 需要长期积累 |

## 一个真实的推荐路径

如果从零开始，我会这么排：

1. **先打 Ethernaut**（免费，1-2 周）——建立攻击面直觉
2. **然后刷 Damn Vulnerable DeFi**（免费，2-4 周）——掌握常见漏洞模式
3. **接着上审计竞赛**（Code4rena 零平台费优先）——拿到第一份公开战绩
4. **同步写技术博客**——把每次提交的发现写成复盘，积累品牌
5. **再考虑接审计单**——有了战绩背书，报价才有议价权
6. **最后冲赏金平台**——此时你已经有能力，但要有接受颗粒无收的心理准备

## 行业背景：为什么这条路一直有人走

补充一组背景数据（来自 [Immunefi 的 2024 年 10 月报告](https://immunefi.com/) 及本文上一篇文章引用的来源）：

| 指标 | 数据 |
| --- | --- |
| 2024 年 10 月累计损失 | 14 亿美元（179 起事件） |
| 当月黑客事件 | 7 起，损失 5,514 万美元 |
| 单笔最大损失 | Radiant Capital 5,000 万美元 |
| 较 2023 年 10 月事件数 | +114% |
| 受攻击最严重链 | BNB Chain（占 50% 损失） |

**判断**：单笔金额增大但事件频率略降——攻击者在向高价值目标集中，弹药集中到了头部协议上。

历史上的标志性案例仍值得记住：**2016 年 The DAO 攻击**利用重入漏洞盗走约 **360 万 ETH**（当时价值约 6000-7000 万美元），最终促成以太坊硬分叉，也催生了后来的形式化验证研究。这个案例至今仍是入门教学的标准素材——它的重入漏洞至今仍在真实项目里出现。

---

## 数据来源与核实

- **平台收费与归属**：Code4rena 于 2024-08-22 被 Zellic 收购（据 CB Insights 交易记录）；Sherlock / Cantina / Spearbit 抽成 10-20%、Code4rena 自 2025 年 6 月零平台费的说法来自第三方梳理，**变动频繁，接单前请直接查各平台官网**。
- **审计报价区间**：文中给出的价格区间来自行业经验谈，**没有权威公开价目表背书**，仅作数量级参考，请勿用于报价。
- **Immunefi 数据**：规模数字来自上一篇文章引用的 Gate 学院科普文，原始统计截止 2024 年 10 月；损失数据来自 Immunefi 报告。
- **The DAO 攻击**：360 万 ETH、当时价值约 6000-7000 万美元，多篇学术论文与安全文献一致记载。
- **平台与项目**：本文不构成对任何平台的推荐或背书。是否参与、如何合规操作，请自行判断并遵守目标所在地法律与项目方的授权条款。

**合规提醒**：所有路径均以**获得明确书面授权**为前提。未经授权测试他人合约可能触犯法律，且会永久损害你的职业声誉。

</div>

<div class="lang-block" data-lang="en" lang="en">

The previous post took the Immunefi mechanism apart but left a more practical question open: **how does an ordinary person actually make money in Web3 security?**

While researching, I spread the ecosystem out and went through it, and the most common misunderstanding turned out to be treating all platforms as one category. The barriers and the payout structures differ enormously: a newcomer can walk away from an audit contest with a few thousand dollars, a single Critical bug on a bounty platform can pay seven figures, and auditing services have an income structure unlike either.

This post compares the five ways to earn in Web3 security side by side, with verifiable barriers to entry and payout ranges. **The numbers come from public sources and platform data, not income promises** — real earnings depend heavily on skill, luck and the market cycle.

<!-- more -->

## Path 1: Bug Bounty

### How It Works

The code is live and the program runs indefinitely: report a bug whenever you find one. Payouts follow severity tiers (Critical / High / Medium / Low) and a single researcher **keeps the full amount**.

### Barriers and Payouts

| Dimension | Reality |
| --- | --- |
| Barrier to entry | **The highest** — you have to find a genuinely exploitable bug |
| Single payout | Criticals reach six figures and up; some cases hit the $10M range |
| Certainty | **The lowest** — months of work can end with nothing |
| Who it fits | People with solid fundamentals who can read complex contract logic |

Public records include a white hat who prevented $400 million in losses with one bug and collected a $10 million bounty (roughly 40x ROI). But that case is the **tail**, not the median.

### Platforms

| Platform | What sets it apart |
| --- | --- |
| **Immunefi** | The largest, with 35,000+ researchers covering 330+ projects |
| **HackerOne** | A general-purpose platform where Web3 is just one segment |
| **Intigriti** | Runs a dedicated Web3 program |
| **BugRap** | Smaller, focused on projects in Asia |

### Reality Check

- **The PoC convention**: white hats write demonstration code without ever triggering the attack. It protects the project and keeps the researcher on the right side of the line.
- **The legal boundary stays blurry**: even with Safe Harbor provisions (up to 60% of the bounty for fund recovery), jurisdictions disagree on what counts as good faith.
- **Most people do not get paid**: this is a textbook power law, with the top white hats taking the overwhelming share.

## Path 2: Audit Contests

### How It Works

This is the path I most want to highlight — **it is the ordinary person's way in**.

The code is not live yet. The project publishes its audit needs with a fixed prize pool, researchers worldwide read the same code at the same time, and **the findings split the pool by value**.

| Dimension | Reality |
| --- | --- |
| Barrier to entry | **The lowest** — basic auditing ability is enough to take part |
| Single payout | Pools of $25k to $500k+, but **split between many researchers** |
| Certainty | **Relatively high** — a valid finding is paid |
| Who it fits | Beginners who want a track record |

### Platforms

| Platform | What sets it apart | Platform fee |
| --- | --- | --- |
| **Code4rena** | Founded in 2021, a decentralized open organization | **Zero platform fee** since June 2025 |
| **Sherlock** | Built around competitive scoring, with a public audit history | 10-20% |
| **Cantina** | The broadest coverage (Web3 + traditional security) | 10-20% |
| **CodeHawks** | Newer and smaller | — |
| **Secure3** | An early platform | — |

> ⚠️ **Code4rena changed hands**: the platform was acquired by Zellic on August 22, 2024. Zellic earns from traditional audit work, and Code4rena has become a talent pipeline and marketing funnel. **Check the official site to confirm whether the fee policy holds after the acquisition** — the "zero platform fee" circulating online reflects one point in time around the acquisition.

### Why It Is the Best Starting Point

1. **It does not block later bounty work**: a public contest record is itself a credential.
2. **The payout is predictable**: valid findings pay, no lottery ticket required.
3. **Many researchers, one codebase**: you see directly what others found, and the feedback density is high.
4. **The pool is transparent**: the project locks it up front, so there is no risk of non-payment.

## Path 3: Auditing Services

### How It Works

Projects commission the work directly: a contract, a fee per engagement. This path **sells time, not luck**.

| Dimension | Reality |
| --- | --- |
| Barrier to entry | **High** — you need a brand the market recognizes |
| Income structure | Priced per project or per day, far steadier than contests |
| Ceiling | Set by personal brand and team size; there is no "get rich overnight" |
| Who it fits | People with a track record who want to go freelance |

### On Pricing

I **could not find a credible public price list**. Most pricing pages found say "contact us for a quote", and some sites have moved to token payment (paying in the native token can halve the price).

The ranges commonly passed around in the industry (**not confirmed by an authoritative source; for reference only**):

- Small contracts (a single token, non-critical logic): from a few thousand dollars
- Mid-sized DeFi protocols (multiple contracts, liquidity pools): tens of thousands
- Large protocols (L2s, cross-chain bridges): the hundred-thousand range

### Reading the Rankings Backwards

From a project's point of view, third-party audit leaderboards exist — smartcontractaudit.com, for example, ranks **first by whether an audited project was later hacked, and only then by user ratings**. Which means:

> **A zero-incident audit record is worth more than ten five-star reviews.**

To keep winning engagements, get your name onto the public leaderboards first.

## Path 4: CTFs and Hands-On Training

### It Pays Nothing Directly, Yet Sets the Ceiling for the First Three

I give it its own section because it is often dismissed as just practice. In reality, **a CTF record is the ticket into the first three paths**.

### Training Platforms

| Platform | Focus |
| --- | --- |
| **Ethernaut** | The best starting point: aimed at developers from a Web2 background, one level at a time |
| **Damn Vulnerable DeFi** | The classic vulnerable playground for offensive security and auditing skills |
| **Capture the Ether** | Level-based challenges themed around DeFi |
| **Mr Steal Yo Crypto** | Medium difficulty, specializing in permission and asset-transfer bugs |
| **RareSkills Solidity Riddles** | Solidity-specific puzzles |
| **Paradigm CTF** | Advanced problems, noticeably harder |
| **Blocksec CTFs** | An aggregator with material from beginner to advanced |

### A Ladder to Climb

| Level | Suggested path |
| --- | --- |
| Beginner | Ethernaut or Capture the Ether |
| Intermediate | Damn Vulnerable DeFi or Mr Steal Yo Crypto |
| Advanced | Paradigm CTF or events like Numen |

**The key point**: all of these platforms are free, and basic Solidity syntax is not hard to pick up. **Finish Ethernaut before touching an audit contest and your success rate jumps by an order of magnitude.**

## Path 5: Content and Teaching

### Why It Deserves Its Own Section

The first four paths trade skill for money; this one trades **the ability to explain**, and it does not compete with the other four.

| Format | Notes |
| --- | --- |
| Technical blog | Bug write-ups and audit methodology — and personal branding at the same time |
| Video courses | Hooked Academy, RareSkills and Smart Contract Security all run structured courses |
| Corporate training | In-house sessions and public classes on Solidity security for development teams |
| Research reports | Bug analyses and reports on how attack techniques evolve |

### The Reality

- **Monetizing traffic alone is hard**: it takes long-term accumulation.
- **But the funnel for a technical writer is clear**: publish bug analyses → build trust → take on audits, consulting and courses.
- **It forms a flywheel with the first four**: the auditing work itself produces the teaching material.

## The Five Paths Side by Side

| Path | Barrier | Certainty | Ceiling | Cost to enter |
| --- | --- | --- | --- | --- |
| Bug bounty | Highest | Lowest | Highest (power law) | No entry cost |
| Audit contests | Lowest | Relatively high | Medium (pool-bound) | Time investment |
| Auditing services | High | High | Medium (brand-bound) | A reputation to back it |
| CTF training | Low | No direct income | — | All free |
| Content and teaching | Medium | Medium | Medium | Long-term accumulation |

## A Realistic Recommended Path

Starting from zero, this is the order I would take:

1. **Play Ethernaut first** (free, 1-2 weeks): build the instinct for attack surfaces.
2. **Then grind Damn Vulnerable DeFi** (free, 2-4 weeks): learn the common bug patterns.
3. **Then enter audit contests** (Code4rena first while the platform fee is zero): earn your first public record.
4. **Write a technical blog alongside**: turn every submitted finding into a write-up and accumulate a brand.
5. **Only then take audit engagements**: with a track record behind you, your quotes carry weight.
6. **Finally aim at the bounty platforms**: by then you have the skill, but be ready for stretches without a payout.

## Industry Context: Why This Road Keeps Drawing People

A set of background numbers (from [Immunefi's October 2024 report](https://immunefi.com/) and the sources cited by the previous post):

| Metric | Figure |
| --- | --- |
| Cumulative losses as of October 2024 | $1.4 billion across 179 incidents |
| Hacks that month | 7 incidents, $55.14 million lost |
| Largest single loss | Radiant Capital, $50 million |
| Incident count vs October 2023 | +114% |
| Most attacked chain | BNB Chain (50% of losses) |

**The read**: individual losses are growing while incidents get slightly rarer — attackers are concentrating on high-value targets, with the ammunition aimed at leading protocols.

One historical case still deserves to be remembered: **the 2016 DAO attack** drained about **3.6 million ETH** (roughly $60–70 million at the time) through a reentrancy flaw, ultimately forcing the Ethereum hard fork and seeding the formal verification research that followed. It remains standard teaching material to this day — and bugs of the same shape still show up in live projects.

---

## Sources and Verification

- **Platform fees and ownership**: Code4rena was acquired by Zellic on 2024-08-22 (per CB Insights deal records); the 10-20% cuts for Sherlock / Cantina / Spearbit and Code4rena's zero platform fee since June 2025 come from third-party overviews and **change frequently — check each platform's own site before committing**.
- **Audit price ranges**: the figures above come from industry folklore, **backed by no authoritative public price list**, and are meant only as orders of magnitude. Do not quote them to clients.
- **Immunefi data**: the scale figures come from the Gate Academy article cited by the previous post, with statistics as of October 2024; the loss data comes from Immunefi reports.
- **The DAO attack**: 3.6 million ETH worth roughly $60–70 million at the time, consistently recorded across academic papers and security literature.
- **Platforms and projects**: this post does not recommend or endorse any platform. Whether to take part and how to stay compliant are your own call, subject to the laws of your jurisdiction and each project's authorization terms.

**Compliance note**: every path above assumes **explicit written authorization**. Testing someone else's contracts without it can be illegal and will permanently damage your professional reputation.

</div>

