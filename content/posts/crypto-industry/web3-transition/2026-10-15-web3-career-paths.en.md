---
title: "'5 Ways to Earn in Web3 Security: Barriers, Payouts and the Real Gap'"
date: 2026-10-15T19:00:00+08:00
topic: "Web3 Transition"
tags:
  - "Web3 Security"
  - "White Hat"
  - "Bug Bounty"
  - "Audit Contest"
  - "Smart Contracts"
  - "Career Path"
image: "img/post/crypto-industry/web3-transition/2026-10-15-web3-career-paths-cover.jpg"
---

The previous post took the Immunefi mechanism apart but left a more practical question open: **how does an ordinary person actually make money in Web3 security?**

While researching, I spread the ecosystem out and went through it, and the most common misunderstanding turned out to be treating all platforms as one category. The barriers and the payout structures differ enormously: a newcomer can walk away from an audit contest with a few thousand dollars, a single Critical bug on a bounty platform can pay seven figures, and auditing services have an income structure unlike either.

This post compares the five ways to earn in Web3 security side by side, with verifiable barriers to entry and payout ranges. **The numbers come from public sources and platform data, not income promises** — real earnings depend heavily on skill, luck and the market cycle.


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
