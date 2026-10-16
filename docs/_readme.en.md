[English](./_readme.en.md) | [简体中文](./_readme.md)

## 📖 Engineering Docs

| Document | Contents |
| --- | --- |
| [📝 Publishing guide](./_publishing-guide.md) | Write a post and get it online: directory conventions, front-matter fields, body syntax, local preview, publishing and rollback (Chinese) |
| [🛠️ Development workflow](./_development-workflow.md) | Branch model (`dev-fix` work branch / `main` deploy branch), commit conventions, verification requirements, branch protection, dependency updates (Chinese) |
| [📋 Changelog](./_changelog.md) | Improvement notes and completed changes, one dated section per entry, newest first (Chinese) |

---

## 📰 Recent Posts

| Title | Category | Date |
| --- | --- | --- |
| 🔗 [What Is REA: An MCP Service That Lets AI Agents Reverse Engineer Anything](https://funlew.github.io/en/artificial-intelligence/agents/2026-10-16-what-is-rea/) | Artificial Intelligence / Agents | 2026-10-16 |
| 🔗 [What Is Jev: How TypeSafe's System One Model Works, What It Costs and How to Try It](https://funlew.github.io/en/artificial-intelligence/models/2026-10-16-what-is-jev/) | Artificial Intelligence / Models | 2026-10-16 |
| 🔗 [5 Ways to Earn in Web3 Security: Barriers, Payouts and the Real Gap](https://funlew.github.io/en/crypto-industry/web3-transition/2026-10-15-web3-career-paths/) | Crypto Industry / Web3 Transition | 2026-10-15 |
| 🔗 [What Is Immunefi: How the Web3 Bug Bounty Platform Works and What the Numbers Say](https://funlew.github.io/en/crypto-industry/web3-security/2026-10-15-what-is-immunefi/) | Crypto Industry / Web3 Security | 2026-10-15 |
| 🔗 [From Login Form to RCE: A 5-Layer Attack Chain Methodology for Web Pentests](https://funlew.github.io/en/cybersecurity/vulnerability-research/2026-10-15-login-to-rce-web-pentest/) | Cybersecurity / Vulnerability Research | 2026-10-15 |
| 🔗 [Beneath the Iceberg: Unclaimed Subdomains Are Exposing Your Infrastructure](https://funlew.github.io/en/cybersecurity/information-gathering/2026-10-15-subdomain-enumeration-asset-discovery/) | Cybersecurity / Information Gathering | 2026-10-15 |
| 🔗 [Account Takeover Through an Email Change That Allocates Before It Verifies](https://funlew.github.io/en/cybersecurity/vulnerability-research/2026-10-14-email-takeover-race-condition/) | Cybersecurity / Vulnerability Research | 2026-10-14 |
| 🔗 [Hello, world!](https://funlew.github.io/en/daily-notes/2026-10-13-hello-world/) | Daily Notes | 2026-10-13 |

---

## 🚀 Quick Start

Node.js 22 is required (same as CI):

```bash
git clone https://github.com/funlew/funlew.github.io.git
cd funlew.github.io
git checkout dev-fix
npm ci
```

Everyday commands:

| Command | What it does |
| --- | --- |
| `npm run server` | Chinese site preview at http://localhost:4000/zh/ |
| `npm run server:en` | English site preview at http://localhost:4001/en/ |
| `npm run clean` | Remove `public/`, `.build/` and the `db.json` cache |
| `npm run build` | Full build: split the languages → `/zh/`, `/en/` → language selection page |

> ⚠️ `npm run deploy` does nothing locally. No deployer is configured; publishing always goes through the Actions run on the `main` branch.

---

## 🗂️ Repository Layout

```
config/          site configurations for both languages (_config.zh.yml / _config.en.yml)
docs/            project documentation
scripts/         style and script injectors, generator wrappers, bilingual build support
scaffolds/       post templates used by hexo new
source/          the blog content (single source of both languages)
themes/icarus/   Icarus theme source
tools/           bilingual build scaffolding (split the source tree / drive both builds)
.build/          build intermediates, gitignored
```

Writing only ever touches `source/`:

| Directory | Purpose |
| --- | --- |
| `source/_posts/` | 📝 Post bodies; the file name becomes the permalink |
| `source/_attach/` | 🖼️ Post images |
| `source/_static/` | 🎨 favicon, avatar, custom CSS/JS |
| `source/_about/` | 📄 Standalone pages such as the about page |

> ℹ️ The underscores are a Hexo requirement (otherwise the directories are ignored); they are allowed through the `include` list of `config/_config.zh.yml`. `docs/` follows the same convention: a `_` prefix means "not blog content". See the [development workflow](./_development-workflow.md) (Chinese).

---

## 🧰 Stack

Hexo 8.1.2 · Icarus 6.1.1 · Inferno (JSX rendering) · Marked · Stylus · highlight.js

The site is **bilingual**: `https://funlew.github.io/zh/` and `https://funlew.github.io/en/` are two complete sites produced by one build; the language button opens the same page in the other language, and both languages are written in the same source files. See the [publishing guide](./_publishing-guide.md#双语内容中文--英文) (Chinese).

**Built-in features**

🔍 Insight site search &nbsp;·&nbsp; ⚡ PJAX navigation &nbsp;·&nbsp; 📑 Table of contents &nbsp;·&nbsp; 💡 Syntax highlighting and copy button &nbsp;·&nbsp; 🖼️ Gallery &nbsp;·&nbsp; 📡 Atom feeds (one per language) &nbsp;·&nbsp; 🌐 Bilingual site &nbsp;·&nbsp; ✨ Progress bar and entrance animation

---

## 📜 License

| Scope | License |
| --- | --- |
| Site content | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) |
| `themes/icarus/` theme code | MIT, copyright [ppoffice](https://github.com/ppoffice/hexo-theme-icarus) |
