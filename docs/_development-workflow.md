# 开发流程

本文档说明 funlew 博客的分支模型、日常开发节奏、提交规范与发布方式。写文章请看 [发布文章流程](./_publishing-guide.md)。

---

## 一、分支模型

仓库采用双分支模型：

| 分支 | 角色 | 推送权限 | 触发部署 |
| --- | --- | --- | --- |
| `main` | 稳定分支，始终对应线上站点 | **禁止直推**，必须走 Pull Request | 是 |
| `dev-fix` | 长期工作分支，日常改动累积在这里 | 可直接推送 | 否 |

`dev-fix` 是长期存在的分支，不要用完即删。改动积累到合适的时机，再开 PR 合入 `main`。

### 为什么这样分工

仓库配置了一条 ruleset 规则：**改动必须通过 Pull Request**。这条规则只作用于 `main`，`dev-fix` 不受影响（已实测确认可以直推）。

这样既保留了 `main` 的保护，又不必为每一次小改动都新建临时分支。代价是 `dev-fix` 会比 `main` 领先若干提交，这是正常的。

### 一次完整的迭代

```
dev-fix  ──●──●──●──●──▶  origin/dev-fix      日常提交，直接推送
              │
              └──PR──▶  main ──▶ Actions ──▶ GitHub Pages
```

---

## 二、环境准备

Node.js 需为 22（与 CI 一致）：

```bash
node -v          # 期望 v22.x
npm ci           # 首次必须安装，仓库不含 node_modules
```

克隆后检出工作分支：

```bash
git clone https://github.com/funlew/funlew.github.io.git
cd funlew.github.io
git checkout dev-fix
```

`dev-fix` 已配置好上游跟踪（`origin/dev-fix`），之后 `git push` 不需要带参数。

---

## 三、日常开发流程

### 仓库目录

```
docs/               项目文档，不是博客内容
scripts/            注入样式与脚本、包装主题生成器、双语构建支持（i18n.js）
config/             两种语言的站点配置（_config.zh.yml、_config.en.yml），由 --config 显式传入
scaffolds/          hexo new 使用的文章模板
source/             博客内容（_posts 文章、_attach 配图、_static 资源、_about 独立页）
themes/icarus/      Icarus 主题源码（纳入版本管理，不是 submodule）
tools/              构建脚手架：prepare-i18n.mjs 拆分双语源树，build.mjs 串联两次生成
.build/             双语构建的中间产物（每次构建重新生成，已 gitignore，不要手改）
_config.icarus.yml  主题配置，固定在站点根目录：Hexo 只从根目录加载 _config.[theme].yml
```

`source/` 下的下划线是 Hexo 的硬性要求：该前缀让 Hexo 跳过这些目录，必须在 `config/_config.zh.yml` 的 `include` 中显式放行。`docs/` 不在 `source/` 下，Hexo 不会处理，所以那里的下划线是纯粹的命名约定——但语义一致，都表示「不是博客内容」。

**`docs/` 命名约定**：文件名一律使用英文小写加短横线，并以 `_` 开头，例如 `_publishing-guide.md`。新增文档请遵守，并同步更新 `README.md` 的索引以及文档之间的互链。

### 日常步骤

```bash
git checkout dev-fix          # 确保在工作分支上
npm run server                # 中文站预览 http://localhost:4000/zh/
npm run server:en             # 英文站预览 http://localhost:4001/en/（另开一个终端）
# ...编辑 source/ 下的文件，两个预览都会自动重新拆分并刷新...
npm run build                 # 完整构建（含双语交叉检查），验证生产环境无报错
git add -A
git commit -m "feat: ..."
git push                     # 直接推送到 dev-fix
```

### 改动后的验证强度

不同类型的改动，验证要求不同：

| 改动位置 | 最低验证 |
| --- | --- |
| `source/_posts/` 文章内容 | `npm run server` / `npm run server:en` 看两种语言的渲染结果 |
| `config/_config.zh.yml` / `config/_config.en.yml` / `_config.icarus.yml` | `npm run build` 完整构建 |
| `scripts/` 下的脚本 | `npm run clean` + `npm run build` + 看构建日志 |
| `tools/` 下的构建脚本 | `npm run clean` + `npm run build`，并确认 `.build/` 与 `public/` 结构 |
| `themes/icarus/` 主题源码 | `npm run clean` + `npm run build` |
| 双语内容（`lang-block` / `*_en` 字段） | 两个预览端口互相点语言按钮，确认跳转与内容都正确 |
| 依赖版本（`package.json`） | `npm run clean` + `npm run build` |

**`scripts/` 目录务必用 `npm run clean` 验证。** 该目录的脚本之间、以及脚本与主题脚本之间存在加载顺序依赖（见下文），`public/` 与残留的 `db.json` 缓存会掩盖问题。

### 依赖加载顺序

`hexo/dist/hexo/load_plugins.js` 中 `loadScripts` 的执行顺序是：

```js
bluebird.filter([ctx.theme_script_dir, ctx.script_dir], ...)
```

即**主题 `scripts/` 先加载，项目 `scripts/` 后加载**。因此项目脚本在加载时能拿到主题已注册的扩展，`scripts/search-index-filter.js` 正是利用这一点来包装主题注册的 `insight` generator。

`scripts/i18n.js` 则依赖**过滤器**的执行顺序：它用 `template_locals` 把 `config/_config.en.yml` 里 `i18n_theme` 的英文界面文案覆盖到页面 locals 上，而这份 locals 是主题的同名过滤器（默认优先级 10）拼出来的，所以它注册在优先级 20。改这一段时注意别把优先级去掉，否则英文站会用回中文菜单。

如果将来新增脚本依赖这个顺序，请在文件注释里写明。

### 双语的构建流程

`npm run build` 实际上是三步（见 `tools/build.mjs`）：

```
tools/prepare-i18n.mjs   source/ → .build/zh、.build/en（拆分语言、挑出 *_en 字段、生成 _data/i18n.json）
hexo generate            .build/zh → public/zh（config/_config.zh.yml），.build/en → public/en（+config/_config.en.yml）
tools/build.mjs 收尾      public/index.html 语言选择页、旧地址重定向、两种语言的链接交叉检查
```

两点容易踩坑：

- **不要在 `source/` 之外手写语言相关内容**：`lang-block` 与 `*_en` 字段是唯一入口，`.build/` 会被覆盖
- **改 `source/` 之后必须重跑 `prepare-i18n.mjs`**（两个 `npm run server` 已经内置了监听，直接改文件即可）

---

## 四、提交规范

沿用 Conventional Commits，前缀风格与仓库既有历史保持一致：

| 前缀 | 用途 | 示例 |
| --- | --- | --- |
| `feat` | 新功能 | `feat: add a donate button to the footer` |
| `fix` | 修复缺陷 | `fix: exclude static assets from the search index` |
| `docs` | 文档 | `docs: add the article publishing guide` |
| `style` | 外观、样式、图标等呈现调整 | `style: use the X logo for the Twitter link` |
| `refactor` | 重构，不改变外部行为 | `refactor: rename source/static to source/_static` |
| `post` | 文章正文的增删改 | `post: update the hello-world title` |
| `chore` | 依赖、文案等杂务 | `chore: capitalize the Gratisography link name` |
| `site` | 站点配置、初始化 | `site: initialize Hexo blog with Icarus theme` |

跨领域改动可加 scope，dependabot 的自动提交即为此形式：

```
chore(deps): bump hexo-pagination from 3.0.0 to 4.0.0
```

### 写法建议

主题的 `scripts/` 目录中已有几段注释说明了「为什么这么做」，新增脚本请延续这个习惯，尤其是涉及 Hexo 内部机制的地方。本项目已经踩过的坑：

- `locals` 在每次 generator 运行前会被 `invalidate()`，不能在 filter 里改它
- 静态资源页面（`layout` 为 `"false"` 的字符串）是文件输出到 `public/` 的机制，不能从 `locals.pages` 里删
- `Generator.register()` 对同名 generator 是覆盖而非追加

这些约束没有写在官方文档里，但决定了实现方式，值得记录。

---

## 五、发布流程

`dev-fix` 上的改动需要合入 `main` 才会上线：

1. 打开 https://github.com/funlew/funlew.github.io/compare/main...dev-fix
2. 创建 Pull Request，填写标题与说明
3. 合并（建议用 Merge commit 或 Rebase merge，原因见下文）
4. Actions 自动构建并部署，约 1～2 分钟
5. 访问 https://funlew.github.io 确认

也可以在 Actions 页面手动触发 `workflow_dispatch`。

### 合并方式的选择

推荐 **Merge commit** 或 **Rebase and merge**，避免使用 Squash：

Squash 会为相同内容生成一个 hash 不同的新提交，导致本地 `main` 与远程分叉，需要额外同步：

```bash
git fetch origin
git checkout main
git reset --hard origin/main
```

用了 Merge commit 时，PR 合并后本地 `dev-fix` 仍与远程一致，只需把 `main` 对齐即可继续下一轮迭代。

---

## 六、回滚

线上出问题时，按影响范围选择：

### 内容或样式错误（最常见）

在 `dev-fix` 上 `git revert` 掉出问题的提交，照常走一次 PR 合入 `main`：

```bash
git revert <commit>
git push
```

重新部署约 1～2 分钟生效。

### 部署本身失败

Actions 页面查看失败原因。若是偶发问题（网络、依赖源抖动），直接 re-run 失败的 job。

### 需要快速恢复线上

新建一个只含回滚的 PR 并优先合并。注意 Pages 只保留最新一次部署的产物，历史版本无法回滚到任意时间点，因此回滚同样是「再部署一次正确内容」。

---

## 七、分支保护

`main` 已由仓库 ruleset 保护（必须走 PR）。建议为 `dev-fix` 单独配置一条 ruleset，**只限制破坏性操作，不要求 PR**——否则会挡住日常直推。

在 **Settings → Rules → Rulesets → New ruleset → Create a new branch ruleset** 中配置：

| 配置项 | 取值 |
| --- | --- |
| Ruleset Name | `protect-dev-fix` |
| Enforcement Status | `Active` |
| Ruleset Target | `Branch` |
| Include branches | 勾选 `dev-fix` |

Rules 部分只勾这两项：

| 规则 | 建议 |
| --- | --- |
| Restrict deletions | 开启，防止分支被误删 |
| Restrict force pushes | 开启，防止历史被改写 |

其余（Require a pull request、Require linear history、Status checks 等）**不要勾选**：

- `Require a pull request` 会让 `dev-fix` 无法直推，与本工作流冲突
- `Status checks` 需要先为 `main` 配置好 required checks，否则会引入额外阻塞

配置后可以用一次普通推送验证未被误锁：若 `git push` 报错说明规则勾多了，回头检查。

---

## 八、依赖更新

`.github/dependabot.yml` 每日检查 npm 依赖，会自动开 PR 分支。

当前积压了几个大版本升级，合并前务必本地验证：

| 依赖 | 版本变化 | 风险 |
| --- | --- | --- |
| `inferno` | 8 → 10 | **最高**。主题的 JSX 渲染依赖它，主题源码在版本管理中，构建失败会直接导致部署失败 |
| `hexo-util` | 3 → 4 | 中 |
| `hexo-pagination` | 3 → 4 | 中 |
| `bulma-stylus` | 0.8 → 0.9 | 低 |

验证方式：

```bash
git checkout dependabot/npm_and_yarn/<依赖>-<版本>
npm ci
npm run clean && npm run build
```

这些 dependabot 分支基于旧的 `main` 创建，与 `dev-fix` 长期领先不冲突；如遇冲突重新生成即可。

---

## 九、故障排查

### 推送被拒绝，报 GH013

```
remote: - Changes must be made through a pull request.
```

这是 `main` 的 ruleset 在起作用，**不是故障**。改推 `dev-fix`：

```bash
git checkout dev-fix
git push
```

### 本地 `main` 领先远程但推不上去

`main` 上累积的提交如果已经存在于 `dev-fix`，把 `main` 对齐远程即可：

```bash
git fetch origin
git checkout main
git reset --hard origin/main
```

提交不会丢失，它们在 `dev-fix` 上。

### 构建产物与预期不符

```bash
npm run clean && npm run build
```

`db.json` 缓存会导致改动不生效，清理后重试。

### 改了主题但行为没变

主题源码在版本管理中（`themes/icarus/`，非 submodule），确认改动确实提交到了该目录，且构建时没有被缓存覆盖。

### Actions 部署成功但站点没更新

确认 PR 合并进了 `main`（部署只监听 `main`），再到 Settings → Pages 确认 Source 为 **GitHub Actions**。
