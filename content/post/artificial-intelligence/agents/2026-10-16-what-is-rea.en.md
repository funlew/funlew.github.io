---
title: "\"What Is REA: An MCP Service That Lets AI Agents Reverse Engineer Anything\""
date: 2026-10-16T16:00:00+08:00
layout: "post"
categories:
  - "Artificial Intelligence"
tags:
  - "REA"
  - "MCP"
  - "Reverse Engineering"
  - "AI Agents"
  - "rea-agents"
image: "img/post/artificial-intelligence/agents/2026-10-16-what-is-rea-cover.jpg"
thumbnail: "img/post/artificial-intelligence/agents/2026-10-16-what-is-rea-cover.jpg"
---

You see a feature in some app that you would like to borrow. The old options were reading the source, or guessing from experience. REA is aimed at the middle path: **let an AI agent work out how it works and show you the evidence**.

REA stands for "Reverse Engineer Anything" — an agent tool that exposes reverse engineering capability through a **single MCP (Model Context Protocol) service** (npm package `rea-agents`, MIT licensed, upstream repository `morluto/rea`). It puts a set of otherwise separate reverse engineering toolchains behind one MCP call, so an agent can investigate binaries, applications and runtime behaviour.

This post is based on the project's Chinese README; the facts and commands come from that source.

## 1. What REA Is

> See a feature you like, work out how it works, go all the way down to the binary.

The typical scenario: you spot a feature worth borrowing, and you ask an AI agent to investigate the app with REA. **Even without the source code**, it can inspect the app, explain how the feature works, show the evidence, and help you build something similar in your own project.

The key word is evidence. REA returns not just a conclusion but the basis for it and the limits that apply.

## 2. How It Works

1. The agent calls REA over **MCP**, inspecting the target and tracing the relevant code;
2. REA returns **findings together with the evidence** behind them;
3. The agent follows up with more questions, explains the behaviour, or writes and tests an implementation;
4. The CLI uses the same workflow.

**A few mechanisms matter**:

- **Analysis runs entirely on your machine** — your application is not uploaded (the agent receives tool results; model providers have their own data policies);
- Results carry both the **evidence** and the **limits** of the conclusion;
- Setup registers REA's MCP service with the agent and installs the matching workflow skill;
- Native analysis reuses an existing **Hopper or Ghidra**; setup can also install Hopper after you approve it. **Static JavaScript analysis needs neither.**

## 3. Supported Analysis Targets

This is REA's most informative table — it breaks "what can the agent do" into a concrete capability matrix:

| Target | What comes back | Requirement |
| --- | --- | --- |
| Native binaries | Pseudocode, assembly, strings, symbols, calls and references | Hopper, Ghidra or IDA |
| Offline ELF layout | Sections, segments, raw symbols and relocations, static mitigation candidates | Linux x64 + caller supplied pwntools |
| EVM bytecode | Dispatch selectors, byte offsets, inferred argument and state mutability | Linux x64 with raw byte or hex input |
| Recorded Linux crashes | Raw notes, per thread registers and signals, optional mapping candidates | Linux x64 + pwntools; optionally GDB/pwndbg |
| JavaScript / Electron | Modules, imports, source maps, routes, IPC, native extension relations | Node.js and npm |
| Websites | Page structure, scripts, network observations, screenshots on request | A Chrome family browser |
| Saved network captures | Requests, responses, reachable payloads and origin positions | HAR; native mitmproxy capture needs mitmdump on Linux |
| .NET assemblies | Metadata, CIL instructions, declared native dependencies, build comparison | Static inspection |
| Android APK | Manifest declarations, classes, decompiled methods and references | Linux/macOS/Windows x64 + headless JADX + full JDK |
| Android devices | Devices, packages, processes, logs, dumps, screenshots, APK and file transfer | Caller supplied adb |
| JEB projects | Project units, artifact summaries, pseudocode of types and methods | A caller started JEB client, selected via `REA_JEB_MCP_URL` |
| Android resources | Decoded manifests, string tables, locales and version info | Caller supplied Apktool launcher |
| Firmware | Regions, extraction results, handoff to native analysis | Binwalk / Unblob on Linux |
| Packages and resources | File manifests, digests, plists, Apple bundle structure, extracted resources | Artifact and JavaScript guides, Apple app guide |
| Process behaviour | Terminal output, interaction, exit and filesystem observations, run comparison | Linux/macOS with a native PTY |

**One boundary is worth noting**: static JavaScript and .NET inspection only **read files and never run the application**; runtime capture, by contrast, **runs the target or interacts with it under your user account**.

## 4. Getting Started

### 1. Set up your agent

Requires Node.js and npm:

```bash
npx rea-agents setup
```

The flow is: pick your agent, review and approve the planned changes, let it add the MCP service and the matching workflow skill, back up your existing configuration, then **restart the agent**.

Supported agents include **Claude Code, Codex, Cursor, Gemini CLI and Grok Build**, among others.

### 2. Ask the agent

```text
Work out how the Notes app search feature works, show the evidence, and build something similar for my project.
```

### 3. Use the terminal CLI

Analyse an unpacked JavaScript/Electron application directory or an ASAR file:

```bash
npx -y rea-agents@latest analyze-javascript-application /absolute/path/to/app --json
```

Install globally:

```bash
npm install --global rea-agents
rea --help
```

Native analysis needs an analysis provider configured first — see the CLI and Evidence guides.

### 4. Update

```bash
rea update                       # CLI installed through npm
npx rea-agents@latest setup      # agent setup done through npx
```

### 5. Runtime requirements

- Node.js **22.x (>= 22.19), 24.x (>= 24.11) or 26+**, plus npm;
- Additional tooling and host support depend on the analysis target (see the table above).

## 5. Key Characteristics

1. **A single MCP service** fronting several reverse engineering toolchains (Hopper, Ghidra, IDA, JADX, adb, Apktool, Binwalk and more);
2. **Evidence driven** — every conclusion carries its evidence and limits;
3. **Local analysis** — the target application is not uploaded;
4. **A multilingual README** — 19 languages;
5. **Community scale** — past the 50,000 GitHub Stars milestone, with a Discord community and an integration on the skills.sh platform;
6. **A compliance statement** — intended for lawful reverse engineering research, analysis and reimplementation only; users must obtain authorisation and follow the law;
7. **Contributing and security** — issues and PRs, with `CONTRIBUTING.md`, test guides and an `architecture.mermaid` diagram; report vulnerabilities per `SECURITY.md`.

## 6. Three Real Cases

| Case | What it did |
| --- | --- |
| **DX-Ball** | Traced the sound calls back to rebuild the panning maths, and reproduced all **63 bytes** of the compiled function, verified against **3,205** original x86 test cases |
| **Notion** | Traced the Electron clipboard bridge (renderer → preload → IPC → main) and inspected the rich format clipboard data |
| **TH04** | Read 16 bit instructions from the original PC-98 game, recovered the fixed angle and aiming angle ring bullet maths, and compared it against the compiler output from the era |

What the three have in common: **the result can be verified byte by byte**, rather than "looks about right".

## 7. Compliance Boundary

The project states its position plainly: **lawful reverse engineering research, analysis and reimplementation only**. Users must obtain authorisation themselves and follow local law; unlawful or unauthorised use is not supported.

That matches the stance of the other reverse engineering and security posts on this blog — the tool is neutral, the boundary is the person using it.

---

## Sources and Notes

- Based on the Chinese README of [`bbylw/rea-cn`](https://github.com/bbylw/rea-cn); the upstream repository is [`morluto/rea`](https://github.com/morluto/rea), npm package `rea-agents`, MIT licensed.
- The README carries no publication date or named author, and this post adds no independent verification. Features, commands and requirements are **as documented upstream**.
- The commands quoted here (`npx rea-agents setup`, `npm install --global`, `analyze-javascript-application`) are **documentation, not something this post executed**. Note that `setup` modifies the agent's MCP configuration, backs up the existing one, and may install Hopper after approval — confirm the impact and your authorisation before running it.

Cover image: [Mechanical Gears](https://gratisography.com/photo/mechanical-gears/) by Gratisography, used under their Free Photo License.
