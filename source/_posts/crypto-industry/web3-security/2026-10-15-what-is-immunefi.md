---
title: Immunefi 是什么：Web3 漏洞悬赏平台核心机制与生态数据
title_en: 'What Is Immunefi: How the Web3 Bug Bounty Platform Works and What the Numbers Say'
date: 2026-10-15 18:00:00
categories:
  - [加密行业, Web3安全]
categories_en:
  - [Crypto Industry, Web3 Security]
tags:
  - Web3 安全
  - 漏洞悬赏
  - Immunefi
  - 智能合约
  - DeFi
  - 白帽黑客
tags_en:
  - Web3 Security
  - Bug Bounty
  - Immunefi
  - Smart Contracts
  - DeFi
  - White Hat
cover: /_attach/crypto-industry/web3-security/2026-10-15-what-is-immunefi-cover.jpg
thumbnail: /_attach/crypto-industry/web3-security/2026-10-15-what-is-immunefi-cover.jpg
---

<div class="lang-block" data-lang="zh-CN" lang="zh-CN">

Web3 行业的特殊性决定了「代码即资产」——一份智能合约可能托管着几亿、几十亿美元的数字资产。**当漏洞意味着真金白银时，传统的「靠审计、靠运气」已经不够用**。Immunefi 是当前全球最大的 Web3 漏洞悬赏平台，把白帽黑客与项目方撮合起来，靠奖励激励发现并修复漏洞。截至文章引用的数据点（2024 年 10 月），它已聚集 35,000+ 名安全研究人员、覆盖 330+ 知名项目，累计支付赏金超过 1 亿美元。

本文基于一篇 Gate 学院科普文章整理的事实数据重写，保留所有可核实的数字与机制描述，**未补充任何投资建议**——Web3 资产本身存在极高风险。

<!-- more -->

## 一、平台规模

| 指标 | 数值 |
| --- | --- |
| 正式上线时间 | 2020 年 12 月 9 日 |
| 创始人 | Mitchell Amador |
| 服务项目数量 | 330+ |
| 注册安全研究人员 | 35,000+ |
| 在主网发现关键漏洞的研究人员 | 1,000+ |
| 帮助用户避免的潜在损失 | 2,500 亿美元+ |
| 已支付漏洞赏金总额 | 1 亿美元+ |
| 当前保护的用户资产规模 | 1,900 亿美元+ |
| 当前可参与漏洞赏金计划总价值 | 1.62 亿美元+ |

合作的知名项目包括 Synthetix、The Graph、Polygon、MakerDAO、Nexus Mutual、SushiSwap、Vesper Finance、Bancor Network、Chainlink 等。

## 二、PoC 共识机制

Immunefi 工作流的核心是 **PoC（Proof of Concept）共识**——白帽黑客发现漏洞后**只编写演示代码，不实际触发攻击**：

1. 白帽编写 PoC 基础代码，展示漏洞利用方式
2. 几乎所有 Immunefi 赏金计划都强制要求提交 PoC
3. 白帽创建账户并提交报告
4. Immunefi 确认漏洞有效性
5. 联合项目方验证
6. 支付赏金

这套机制的关键设计是**「先证明、后解决」**——项目方在漏洞被公开前能及时知道问题并修复，避免攻击者抢跑。

## 三、漏洞严重性分级（v2.3）

四级划分：

- **关键（Critical）**：可造成资金直接损失的严重漏洞
- **高（High）**：重要功能受影响但限制条件较多
- **中（Medium）**：影响有限、需要特定条件才能利用
- **低（Low）**：理论问题或最佳实践偏离

**不在范围内的问题**：
- 测试文件中的漏洞
- 治理相关攻击（如提案流程的设计缺陷）
- Immunefi 管辖外的经济风险（如市场波动、流动性问题）

## 四、主要功能

### 1. 个人档案 + 徽章

白帽黑客可以展示成就与排名，平台提供六种徽章：

| 徽章 | 获得条件 |
| --- | --- |
| One Of Us | 完成档案并填写所有社交媒体链接 |
| Bought The BMW | 在平台累计赚取 10 万美元+ |
| There's Grass Outside, You Know | 累计赚取 100 万美元+ |
| Friends In High Places | 档案链接到 Twitter 简介 |
| High Five | 获得 5 个赏金 |
| Rocketman | 成功发现来自 Boost 计划的有效赏金 |

### 2. 审计竞赛

时间敏感的代码审查活动，特点是：

- **比大多数传统审计成本低 20%**
- 实时更新排行榜
- 先发现者按比例分享奖金
- 适合新合约上线前的紧急审查

### 3. 白帽奖项分层

按累计收入划分四档（数字 NFT + 实物奢侈品奖励）：

| 层级 | 累计收入门槛 |
| --- | --- |
| 初级层（Initiate） | 5 万美元+ |
| 精英层（Elite） | 10 万美元+ |
| 大师层（Master） | 100 万美元+（计划中）|
| 宗师层（Grandmaster） | 1,000 万美元+（计划中）|

### 4. Whitehat Hall of Fame NFT

每次重要且成功的漏洞报告会铸造一个独一无二的 NFT——白帽可免费保留，也可卖给希望收藏 Web3 安全历史时刻的收藏家。这是平台把「白帽成就」做成**可携带的数字资产**的一种尝试。

### 5. 仅限邀请计划

项目方可以筛选最合格的研究人员，参与受限计划：

- 定制化保密条款
- 资产可见性控制
- 灵活的发布偏好
- 缩短威胁发现到修复的时间窗

适合**核心合约升级、桥接密钥变更**等高敏感场景。

## 五、Vaults 与 Safe Harbor

### Vaults（资产金库）

项目方在 10 分钟内即可完成 Vault 设置，特点：

- 白帽可查看赏金余额（**建立信任**）
- 赏金支付直接从 Vault 发放，含钱包验证防错付
- 当前支持链：以太坊、Optimism（计划扩展到 Polygon、Gnosis Chain、Arbitrum）
- 资产类型：稳定币、ETH 及 Uniswap 代币列表中的任何资产
- 单笔交易可使用一种或多种资产支付

### Safe Harbor

由 **SEAL（Security Alliance）** 创建的法律保护机制：

- 白帽在紧急情况下拦截资金时，可获最高关键赏金 60% 的报酬
- 受威胁资金重定向至 Immunefi 管理的 Vault
- 为白帽提供**法律层面的"安全港"**——避免事后被项目方起诉

这套机制解决了**「白帽救火反而被追责」**的尴尬现实。

## 六、Web3 常见漏洞类型

| 漏洞类型 | 描述 | 典型案例 |
| --- | --- | --- |
| 可重入攻击 | 智能合约在首次执行未完成时允许多次调用自身，耗尽资金 | 2016 年 DAO 事件（以太坊） |
| 预言机/价格操控 | 篡改预言机提供虚假价格，攻击者套利 | 多个 DeFi 项目被攻击 |
| 弱访问控制 | 权限设计过粗或单点控制 | 私钥/账户泄露即严重损失 |
| 抢跑攻击 | 利用内存池观察待处理交易，提交更高 Gas 抢先执行 | 去中心化交易所常见 |
| 未初始化代理 | 代理合约使用前未正确设置存储变量，攻击者可操控 | 多起合约入侵事件 |

**防御建议**（来自原文整理）：
- 智能合约使用可重入保护（如 ReentrancyGuard）
- 预言机用去中心化多源方案
- 角色权限细化，避免单点
- 升级代理前严格初始化

## 七、行业损失背景

文章引用的 **2024 年 10 月** 数据（来自 Immunefi 自身报告）：

| 指标 | 数据 |
| --- | --- |
| 当月累计损失 | 14 亿美元（179 起事件） |
| 较 2023 年 10 月 | 下降 1% |
| 当月黑客事件 | 7 起，损失 5,514 万美元 |
| 较 2023 年 10 月 | +114% |
| 单笔最大损失 | Radiant Capital 5,000 万美元 |
| 第二大损失 | Tapioca DAO 440 万美元 |
| 受影响领域 | 仅 DeFi |
| 受攻击最严重链 | BNB Chain（占 50% 损失） |

**判断**：单笔金额增大但事件频率略降——攻击者在向"高价值目标"集中。

## 八、值得思考的几点

- **不是投资品**。Immunefi 本身是服务平台（可能发币，但本文不涉及），与平台挂钩的**资产本身**有极高风险。本文不构成任何投资建议。
- **漏洞悬赏是补强，不是替代**。代码审计、形式化验证、测试覆盖率——这些是基础；漏洞悬赏是上线后的"持续审计"，但不能阻止所有问题。
- **法律风险仍在**。Safe Harbor 覆盖范围有限，且不同司法辖区对"白帽行为"的认定不同。
- **数据时效**。本文引用的 1.9 万亿/1.62 亿/35,000 等数据来自原文 2024 年 10 月的快照，**当前数字应通过 Immunefi 官网实时核实**。

---

## 数据时点与引用

- **数据时点**：本文引用的 Immunefi 规模数据来自原文 2026-04-05 发布版本，原始统计截止 **2024 年 10 月**。
- **作者信息**：原文由 Tamilore 撰写，经译者 Viper 与审校 Piccolo、Matheus、Ashely 协作完成。
- **原文出处**：[介绍 ImmuneFi：全球领先的漏洞赏金平台](https://www.gate.com/zh/learn/articles/an-introduction-to-immune-fi-the-world-s-leading-bug-bounty-platform/4976) —— Gate 学院

封面图：[Gorilla on Computer](https://gratisography.com/photo/gorilla-on-computer/) by Gratisography，依其 Free Photo License 使用——大猩猩双手在笔记本键盘上敲击，与"野生白帽黑客找漏洞"形成视觉对照。

</div>

<div class="lang-block" data-lang="en" lang="en">

Web3 has a property few industries share: code is capital. A single smart contract can hold hundreds of millions or billions of dollars in digital assets. **When a bug translates straight into money, auditing and luck are not enough on their own.** Immunefi is the largest Web3 bug bounty platform today, matching white hat hackers with projects and paying rewards for finding and fixing vulnerabilities. As of the data point cited here (October 2024), it has gathered 35,000+ security researchers across 330+ well-known projects and paid out more than $100 million in bounties.

This post rewrites the factual data from a Gate Academy explainer, keeps every verifiable number and mechanism description intact, and **adds no investment advice** — Web3 assets themselves carry extreme risk.

<!-- more -->

## 1. Platform Scale

| Metric | Value |
| --- | --- |
| Launched | December 9, 2020 |
| Founder | Mitchell Amador |
| Projects served | 330+ |
| Registered security researchers | 35,000+ |
| Researchers who found critical bugs on mainnet | 1,000+ |
| Potential losses avoided for users | $250 billion+ |
| Total bounties paid | $100 million+ |
| User assets currently protected | $190 billion+ |
| Total value of active bounty programs | $162 million+ |

Notable partner projects include Synthetix, The Graph, Polygon, MakerDAO, Nexus Mutual, SushiSwap, Vesper Finance, Bancor Network and Chainlink.

## 2. The PoC Consensus Mechanism

At the heart of the Immunefi workflow is the **PoC (proof of concept) consensus** — after finding a bug, a white hat **writes demonstration code without ever triggering the attack**:

1. The white hat writes baseline PoC code showing how the bug is exploited.
2. Nearly every Immunefi bounty program requires a PoC submission.
3. The white hat creates an account and files the report.
4. Immunefi confirms the vulnerability is valid.
5. The project is brought in to verify.
6. The bounty is paid.

The key design is **prove first, fix second** — the project learns about the problem and fixes it before the bug goes public, staying ahead of attackers.

## 3. Severity Classification (v2.3)

Four tiers:

- **Critical**: severe bugs that cause direct loss of funds
- **High**: important functionality is affected, but with significant constraints
- **Medium**: limited impact requiring specific conditions
- **Low**: theoretical issues or deviations from best practice

**Out of scope**:
- bugs in test files
- governance-related attacks (such as design flaws in a proposal process)
- economic risks outside Immunefi's purview (market volatility, liquidity issues)

## 4. Key Features

### 1. Profiles and Badges

White hats can showcase achievements and rankings, and the platform offers six badges:

| Badge | Requirement |
| --- | --- |
| One Of Us | Complete your profile and fill in every social media link |
| Bought The BMW | Earn $100k+ on the platform |
| There's Grass Outside, You Know | Earn $1 million+ |
| Friends In High Places | Link your profile to your Twitter bio |
| High Five | Receive 5 bounties |
| Rocketman | Find a valid bounty through the Boost program |

### 2. Audit Competitions

Time-boxed code review events, characterized by:

- **20% cheaper than most traditional audits**
- live-updating leaderboards
- first finders share the rewards proportionally
- suited to urgent reviews before a new contract goes live

### 3. White Hat Award Tiers

Four tiers by cumulative earnings (digital NFTs plus physical luxury rewards):

| Tier | Cumulative earnings |
| --- | --- |
| Initiate | $50k+ |
| Elite | $100k+ |
| Master | $1 million+ (planned) |
| Grandmaster | $10 million+ (planned) |

### 4. Whitehat Hall of Fame NFTs

Every significant, successful bug report mints a unique NFT — the white hat can keep it for free or sell it to collectors who want a piece of Web3 security history. It is the platform's attempt to turn **white hat achievements into a portable digital asset**.

### 5. Invite-Only Programs

Projects can hand-pick the most qualified researchers for restricted programs:

- tailored confidentiality terms
- control over asset visibility
- flexible disclosure preferences
- a shorter window from discovery to fix

It suits highly sensitive moments such as **core contract upgrades and bridge key rotations**.

## 5. Vaults and Safe Harbor

### Vaults

Projects can set up a Vault in under 10 minutes. Key points:

- White hats can see the bounty balance (**building trust**).
- Payouts are made straight from the Vault, with wallet verification guarding against misdirected payments.
- Currently supported chains: Ethereum and Optimism, with Polygon, Gnosis Chain and Arbitrum planned.
- Asset types: stablecoins, ETH and any asset on the Uniswap token list.
- A single transaction can pay in one asset or several.

### Safe Harbor

A legal protection mechanism created by **SEAL (Security Alliance)**:

- A white hat who intercepts funds in an emergency can earn up to 60% of the relevant critical bounty.
- The threatened funds are redirected into a Vault managed by Immunefi.
- It gives white hats a **legal safe harbor** — protection against being sued by the project afterwards.

The mechanism addresses an awkward reality: **the white hat who puts out the fire ends up in court**.

## 6. Common Web3 Vulnerability Types

| Type | Description | Notable case |
| --- | --- | --- |
| Reentrancy | A contract lets itself be called again before the first execution finishes, draining funds | The 2016 DAO incident (Ethereum) |
| Oracle / price manipulation | Falsified oracle prices let an attacker arbitrage | Multiple DeFi projects attacked |
| Weak access control | Overly coarse permissions or a single point of control | Leaked private keys or accounts mean serious losses |
| Front-running | Reading pending transactions in the mempool and paying higher gas to get ahead | Common on decentralized exchanges |
| Uninitialized proxy | A proxy contract's storage is not set correctly before use, leaving it attacker-controlled | Several contract compromises |

**Defensive advice** (from the source):
- use reentrancy guards in contracts (ReentrancyGuard and the like)
- use decentralized, multi-source oracles
- break roles down to fine-grained permissions and avoid single points
- strictly initialize proxies before upgrading

## 7. The Industry Loss Picture

The **October 2024** figures cited by the source (from Immunefi's own reports):

| Metric | Figure |
| --- | --- |
| Cumulative losses that month | $1.4 billion across 179 incidents |
| vs October 2023 | down 1% |
| Hacks that month | 7 incidents, $55.14 million lost |
| vs October 2023 | +114% |
| Largest single loss | Radiant Capital, $50 million |
| Second largest | Tapioca DAO, $4.4 million |
| Sector affected | DeFi only |
| Most attacked chain | BNB Chain (50% of losses) |

**The read**: individual losses are growing while incidents get slightly rarer — attackers are concentrating on high-value targets.

## 8. Points Worth Thinking About

- **Not an investment vehicle.** Immunefi itself is a service platform (it may issue a token, which this post does not cover), and any **asset** tied to the platform carries extreme risk. Nothing here is investment advice.
- **Bounties reinforce audits, they do not replace them.** Code audits, formal verification and test coverage are the foundation; bug bounties are continuous auditing after launch, and they cannot stop every problem.
- **Legal risk remains.** Safe Harbor's coverage is limited, and jurisdictions disagree on what counts as white hat behavior.
- **Data ages.** The $190B / $162M / 35,000 figures cited here come from the October 2024 snapshot in the source; **verify current numbers on the Immunefi website**.

---

## Data Date and Sources

- **Data date**: the scale figures come from the 2026-04-05 version of the source article, with the original statistics as of **October 2024**.
- **Credits**: the source was written by Tamilore, translated by Viper and reviewed by Piccolo, Matheus and Ashely.
- **Source**: [介绍 ImmuneFi：全球领先的漏洞赏金平台](https://www.gate.com/zh/learn/articles/an-introduction-to-immune-fi-the-world-s-leading-bug-bounty-platform/4976) — Gate Academy

Cover: [Gorilla on Computer](https://gratisography.com/photo/gorilla-on-computer/) by Gratisography, used under its Free Photo License — a gorilla typing on a laptop keyboard, a visual counterpoint to the wild white hat hunting for bugs.

</div>

