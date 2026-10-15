## 📖 工程文档

| 标题 | 内容 |
| --- | --- |
| [📝 发布流程](./docs/_publishing-guide.md) | 写一篇新文章并让它上线：目录约定、front-matter 字段、正文写法、本地预览、发布与回滚 |
| [🛠️ 开发流程](./docs/_development-workflow.md) | 分支模型（`dev-fix` 工作分支 / `main` 部署分支）、提交规范、验证要求、分支保护、依赖升级 |

---

## 📰 最新文章

| 标题 | 分类 | 日期 |
| --- | --- | --- |
| 🔗 [Web3 安全赚钱的 5 条路径：门槛、收益与真实差距](https://funlew.github.io/cybersecurity/vulnerability-research/2026-10-15-web3-career-paths/) | 网络安全 / 漏洞挖掘 | 2026-10-15 |
| 🔗 [Immunefi 是什么：Web3 漏洞悬赏平台核心机制与生态数据](https://funlew.github.io/cybersecurity/vulnerability-research/2026-10-15-what-is-immunefi/) | 网络安全 / 漏洞挖掘 | 2026-10-15 |
| 🔗 [从登录框到 RCE：Web 渗透测试的 5 层攻击链方法论](https://funlew.github.io/cybersecurity/vulnerability-research/2026-10-15-login-to-rce-web-pentest/) | 网络安全 / 漏洞挖掘 | 2026-10-15 |
| 🔗 [冰山之下：那些没人认领的子域名，正在暴露你的基础设施](https://funlew.github.io/cybersecurity/information-gathering/2026-10-15-subdomain-enumeration-asset-discovery/) | 网络安全 / 信息搜集 | 2026-10-15 |
| 🔗 [邮箱修改先分配后校验导致的账号接管漏洞](https://funlew.github.io/cybersecurity/vulnerability-research/2026-10-14-email-takeover-race-condition/) | 网络安全 / 漏洞挖掘 | 2026-10-14 |
| 🔗 [Hello，world！](https://funlew.github.io/daily-notes/2026-10-13-hello-world/) | 日常随笔 | 2026-10-13 |


---

## 🚀 快速开始

需要 Node.js 22（与 CI 一致）：

```bash
git clone https://github.com/funlew/funlew.github.io.git
cd funlew.github.io
git checkout dev-fix
npm ci
```

日常开发命令：

| 命令 | 作用 |
| --- | --- |
| `npm run server` | 启动本地预览，http://localhost:4000 |
| `npm run clean` | 清除 `public/` 与 `db.json` 缓存 |
| `npm run build` | 生成静态站点到 `public/` |

> ⚠️ `npm run deploy` 在本地无效。站点未配置 deployer，发布一律通过 `main` 分支的 Actions 完成。

---

## 🗂️ 仓库结构

```
docs/            项目文档
scripts/         注入样式与脚本、包装主题生成器
scaffolds/       hexo new 使用的文章模板
source/          博客内容
themes/icarus/   Icarus 主题源码
```

写作只需关注 `source/`：

| 目录 | 用途 |
| --- | --- |
| `source/_posts/` | 📝 文章正文，文件名会成为永久链接 |
| `source/_attach/` | 🖼️ 文章配图 |
| `source/_static/` | 🎨 favicon、头像、自定义 CSS/JS |
| `source/_about/` | 📄 关于页等独立页面 |

> ℹ️ 这些目录的下划线是 Hexo 的要求（否则会被忽略），已在 `_config.yml` 的 `include` 中放行。`docs/` 同理采用 `_` 前缀表示「不是博客内容」，详见 [开发流程](./docs/_development-workflow.md)。

---

## 🧰 技术栈

Hexo 8.1.2 · Icarus 6.1.1 · Inferno（JSX 渲染）· Marked · Stylus · highlight.js

**内置功能**

🔍 Insight 站内搜索 &nbsp;·&nbsp; ⚡ PJAX 无刷新切换 &nbsp;·&nbsp; 📑 文章目录 &nbsp;·&nbsp; 💡 代码高亮与复制 &nbsp;·&nbsp; 🖼️ 图库 &nbsp;·&nbsp; 📡 Atom RSS &nbsp;·&nbsp; ✨ 启动动画与进度条

---

## 📜 许可

| 范围 | 许可 |
| --- | --- |
| 站点内容 | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) |
| `themes/icarus/` 主题代码 | MIT，版权归 [ppoffice](https://github.com/ppoffice/hexo-theme-icarus) |
