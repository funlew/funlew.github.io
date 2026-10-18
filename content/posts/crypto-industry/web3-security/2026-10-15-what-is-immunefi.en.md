---
title: "'What Is Immunefi: How the Web3 Bug Bounty Platform Works and What the Numbers Say'"
date: 2026-10-15T18:00:00+08:00
topic: "Web3 Security"
tags:
  - "Web3 Security"
  - "Bug Bounty"
  - "Immunefi"
  - "Smart Contracts"
  - "DeFi"
  - "White Hat"
image: "img/post/crypto-industry/web3-security/2026-10-15-what-is-immunefi-cover.jpg"
---

Web3 has a property few industries share: code is capital. A single smart contract can hold hundreds of millions or billions of dollars in digital assets. **When a bug translates straight into money, auditing and luck are not enough on their own.** Immunefi is the largest Web3 bug bounty platform today, matching white hat hackers with projects and paying rewards for finding and fixing vulnerabilities. As of the data point cited here (October 2024), it has gathered 35,000+ security researchers across 330+ well-known projects and paid out more than $100 million in bounties.

This post rewrites the factual data from a Gate Academy explainer, keeps every verifiable number and mechanism description intact, and **adds no investment advice** — Web3 assets themselves carry extreme risk.


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
