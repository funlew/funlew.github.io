---
title: REA 是什么：让 AI 智能体做逆向工程的 MCP 服务
title_en: "What Is REA: An MCP Service That Lets AI Agents Reverse Engineer Anything"
date: 2026-10-16 16:00:00
categories:
  - [人工智能, 智能体]
categories_en:
  - [Artificial Intelligence, Agents]
tags:
  - REA
  - MCP
  - 逆向工程
  - AI 智能体
  - rea-agents
tags_en:
  - REA
  - MCP
  - Reverse Engineering
  - AI Agents
  - rea-agents
cover: /_attach/artificial-intelligence/agents/2026-10-16-what-is-rea-cover.jpg
thumbnail: /_attach/artificial-intelligence/agents/2026-10-16-what-is-rea-cover.jpg
---

<div class="lang-block" data-lang="zh-CN" lang="zh-CN">

在某个应用里看到一个想借鉴的功能，过去要么读源码，要么靠经验猜。REA 想解决的是中间那条路：**让 AI 智能体去看懂它，并把证据摆出来**。

REA 是「Reverse Engineer Anything」的缩写，一个通过**单个 MCP（Model Context Protocol）服务**提供逆向分析能力的智能体工具（npm 包名 `rea-agents`，MIT 许可，上游仓库 `morluto/rea`）。它把一堆原本各自独立的逆向工具链统一到一次 MCP 调用背后，让智能体能对二进制、应用和运行时行为做调查。

本文基于该项目的中文 README 整理，事实与命令均来自原文。

<!-- more -->

## 一、项目定位

> 看到喜欢的功能，弄清它的工作原理，深入到二进制层面。

典型场景是这样的：在某个应用里看到一个想借鉴的功能，让 AI 智能体用 REA 调查这个应用——**即使没有源代码**，也能检查应用、解释功能原理、展示证据，然后在自己的项目里实现类似功能。

关键词是「证据」。REA 返回的不只是结论，还有支撑结论的依据和适用范围。

## 二、工作流程

1. 智能体通过 **MCP** 调用 REA，检查目标并追踪相关代码；
2. REA 返回**发现结果及对应证据**（evidence）；
3. 智能体据此提出后续问题、解释行为，或编写并测试实现；
4. CLI 命令使用同样的工作流。

**几个关键机制**：

- **分析全部在本机运行**，不上传用户的应用（智能体接收工具结果，模型提供商另有数据政策）；
- 结果包含支撑结论的**证据**和**相关限制**；
- 设置流程会向智能体注册 REA 的 MCP 服务，并安装匹配的工作流指引（skill）；
- 原生分析可复用已有的 **Hopper 或 Ghidra**；设置流程也能在用户批准后安装 Hopper。**静态 JavaScript 分析不需要**这两个引擎。

## 三、支持的分析目标

这是 REA 最有信息量的一张表——它把「智能体能做什么」拆成了具体的能力矩阵：

| 目标类型 | 返回内容 | 要求 |
| --- | --- | --- |
| 原生二进制文件 | 伪代码、汇编、字符串、符号、调用和引用 | Hopper、Ghidra 或 IDA |
| 离线 ELF 布局 | 节、段、原始符号/重定位信息、静态防护候选项 | Linux x64 + 调用方提供的 pwntools |
| EVM 字节码 | 分派选择器、字节偏移、推断的参数和状态可变性 | Linux x64 本地原始字节/十六进制输入 |
| 已记录的 Linux 崩溃 | 原始 note 记录、每线程寄存器/信号、可选映射候选项 | Linux x64 + pwntools；可选 GDB/pwndbg |
| JavaScript / Electron | 模块、导入、source map、路由、IPC、原生扩展关系 | Node.js 和 npm |
| 网站 | 页面结构、脚本、网络观察结果、按请求获取的截图 | Chrome 系浏览器 |
| 已保存的网络捕获 | 请求、响应、可访问的载荷和来源位置 | HAR；原生 mitmproxy 捕获需 Linux 上的 mitmdump |
| .NET 程序集 | 元数据、CIL 指令、声明的原生依赖和构建对比 | 静态检查 |
| Android APK | 清单声明、类、反编译的方法和引用 | Linux/macOS/Windows x64 + 无界面 JADX + 完整 JDK |
| Android 设备 | 设备、软件包、进程、日志、转储、截图、APK/文件传输 | 调用方提供的 adb |
| JEB 项目 | 项目单元、工件摘要、类型/方法的伪代码 | 调用方启动的 JEB 客户端，通过 `REA_JEB_MCP_URL` 选择 |
| Android 资源 | 解码后的清单、字符串表、语言区域和版本信息 | 调用方提供的 Apktool 启动器 |
| 固件 | 区域、提取结果、转交原生分析的内容 | Linux 上的 Binwalk / Unblob |
| 软件包与资源 | 文件清单、摘要、plist、Apple bundle 结构、提取的资源 | 制品与 JavaScript 指南、Apple 应用指南 |
| 进程行为 | 终端输出、交互、退出和文件系统观察结果、运行对比 | 支持原生 PTY 的 Linux/macOS |

**两类行为的边界值得留意**：静态 JavaScript 和 .NET 检查**只读取文件、不运行应用**；而运行时捕获会**以用户权限运行目标或与之交互**。

## 四、使用方法

### 1. 设置智能体

要求 Node.js + npm：

```bash
npx rea-agents setup
```

流程是：选择智能体 → 检查计划中的变更并批准 → 自动添加 MCP 服务和匹配的工作流指引 → 备份已有配置 → **完成后重启智能体**。

支持的智能体包括 **Claude Code、Codex、Cursor、Gemini CLI、Grok Build** 等。

### 2. 向智能体提问

```text
弄清 Notes 应用的搜索功能如何工作，展示证据，并为我的项目实现类似功能。
```

### 3. 使用终端 CLI

分析已解包的 JavaScript/Electron 应用目录或 ASAR 文件：

```bash
npx -y rea-agents@latest analyze-javascript-application /absolute/path/to/app --json
```

全局安装：

```bash
npm install --global rea-agents
rea --help
```

原生分析需先配置分析提供方（详见其 CLI 与 Evidence 指南）。

### 4. 更新

```bash
rea update                       # 通过 npm 安装的 CLI
npx rea-agents@latest setup      # 通过 npx 设置智能体时
```

### 5. 运行环境

- Node.js **22.x（>= 22.19）、24.x（>= 24.11）或 26+**，以及 npm；
- 额外的工具与主机支持取决于分析目标（见上一节表格）。

## 五、关键特性

1. **单一 MCP 服务**统一接入多种逆向工具链（Hopper / Ghidra / IDA / JADX / adb / Apktool / Binwalk 等）；
2. **证据驱动**——所有结论附带证据与限制说明；
3. **本地分析**，不上传目标应用；
4. **多语言 README**——共 19 种语言；
5. **社区规模**——50,000 GitHub Stars 里程碑，有 Discord 社区，并接入技能平台 skills.sh；
6. **合规声明**——仅面向合法的逆向工程研究、分析与重建，用户需自行取得授权并遵守法律；
7. **贡献与安全**——issue / PR 渠道，配套 `CONTRIBUTING.md`、测试指南、`architecture.mermaid` 架构图；漏洞按 `SECURITY.md` 报告。

## 六、三个真实案例

| 案例 | 做了什么 |
| --- | --- |
| **DX-Ball** | 沿声音调用追踪重建声像计算，通过 **3,205 个**原始 x86 测试用例，复现编译后函数的全部 **63 个字节** |
| **Notion** | 追踪 Electron 剪贴板桥（渲染进程 → preload → IPC → 主进程），检查富格式剪贴板数据 |
| **TH04** | 检查原始 PC-98 游戏的 16 位指令，恢复固定角度与瞄准角度的环形子弹计算，并与当年编译器输出对比 |

三个案例的共同点是：**结论可以逐字节验证**，而不是「看起来像」。

## 七、合规边界

项目的定位写得很清楚：**仅面向合法的逆向工程研究、分析与重建**。使用者需要自行取得授权并遵守所在地法律，不支持非法或未经授权的用途。

这一点和本博客其他逆向/安全类内容一致——工具本身是中性的，边界在使用者。

---

## 数据来源与说明

- 本文基于 [`bbylw/rea-cn`](https://github.com/bbylw/rea-cn) 的中文 README 整理；上游主仓库为 [`morluto/rea`](https://github.com/morluto/rea)，npm 包名 `rea-agents`，MIT 许可。
- 原文未标注发布日期与具体作者，本博客也未做额外核验。功能、命令与环境要求**以官方 README 与文档为准**。
- 文中出现的 `npx rea-agents setup`、`npm install --global`、`analyze-javascript-application` 等命令**均为文档内容，本文整理时未执行任何命令**。其中 `setup` 会修改智能体的 MCP 配置、备份现有配置，并可能在批准后安装 Hopper——执行前请确认影响与授权。

封面图：[Mechanical Gears](https://gratisography.com/photo/mechanical-gears/) by Gratisography，依其 Free Photo License 使用。

</div>

<div class="lang-block" data-lang="en" lang="en">

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

</div>
