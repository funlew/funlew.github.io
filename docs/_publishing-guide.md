# 发布文章流程

本文档说明 funlew 博客（Hexo + Icarus）从本地写稿到线上可见的完整流程。

---

## 一、环境准备

Node.js 版本需与 CI 保持一致（`.github/workflows/deploy.yml` 中为 `22`）：

```bash
node -v          # 期望 v22.x
npm ci           # 仓库不含 node_modules，首次必须先安装
```

`package-lock.json` 已提交，CI 用的是 `npm ci`，本地也推荐用 `npm ci` 以保证依赖树完全一致。日常改动依赖后用 `npm install`。

常用脚本（定义在 `package.json`）：

| 命令 | 作用 |
| --- | --- |
| `npm run server` | 启动本地预览服务（默认 http://localhost:4000） |
| `npm run clean` | 清除 `public/` 与缓存数据库 `db.json` |
| `npm run build` | 生成静态站点到 `public/` |
| `npm run deploy` | **本地无效**，站点未配置 deployer，发布只走 Actions |

---

## 二、目录约定

| 目录 | 用途 |
| --- | --- |
| `source/_posts/` | 文章正文，**按分类建子目录**，文件名参与永久链接 |
| `source/_attach/` | 文章配图，**按与 `_posts` 相同的分类目录存放** |
| `source/_static/` | 站点级静态资源：favicon、头像、自定义 CSS/JS |
| `source/_about/` | 关于页等独立页面 |

### 双语页面（关于页）

站点只有一份 HTML，构建语言固定为 `zh-CN`；界面语言由导航栏的语言按钮在浏览器里切换（`source/_static/js/lang-switch.js`）。需要中英双语的**页面内容**，就把两种语言写进同一个文件，各占一个语言块：

```markdown
<div class="lang-block" data-lang="zh-CN" lang="zh-CN">

## 关于我

中文内容……

</div>

<div class="lang-block" data-lang="en" lang="en">

## About Me

English content...

</div>
```

规则：

- **`<div>` 与正文之间必须空行**，否则 marked 会把块内的内容当 HTML 原样输出，markdown 不再渲染
- 样式表 `source/_static/css/i18n.css`（由 `scripts/i18n-inject.js` 注入）按 `<html lang>` 只显示当前语言的那一块，而 `lang-switch.js` 切换语言时会同步这个属性——所以**不用改任何脚本**
- 块默认隐藏、只显示匹配语言的那一块；没有 `<html lang>` 时回落到 `zh-CN` 块，保证文字不会消失
- 新增语种时复制一个块改 `data-lang` 即可
- **页面 front-matter 要写 `toc: false`**：目录组件是构建期按正文里的**全部**标题生成的，两种语言的二级标题会各占一条。关于页即如此（站点默认 `toc: true`）
- 页面标题仍用中文写 front-matter 的 `title`，英文由 `lang-switch.js` 的词表翻译；新页面的标题要跟随语言切换，需要在词表 `DICT` 里补一条

参考文件：`source/_about/index.md`。

### 分类目录结构

`_posts` 与 `_attach` 都按文章分类建目录，**目录名用分类的英文翻译**，层级与分类层级一致：

```
source/_posts/
├── cybersecurity/                                   # 网络安全
│   ├── information-gathering/                       #   信息搜集
│   │   └── 2026-10-15-subdomain-enumeration-asset-discovery.md
│   └── vulnerability-research/                      #   漏洞挖掘
│       ├── 2026-10-14-email-takeover-race-condition.md
│       ├── 2026-10-15-login-to-rce-web-pentest.md
│       ├── 2026-10-15-web3-career-paths.md
│       └── 2026-10-15-what-is-immunefi.md
└── daily-notes/                                     # 日常随笔
    └── 2026-10-13-hello-world.md
```

封面图放在 `_attach` 下**对应的同名分类目录**：

```
source/_attach/
├── cybersecurity/
│   ├── information-gathering/2026-10-15-...-cover.jpg
│   └── vulnerability-research/2026-10-15-...-cover.jpg
└── daily-notes/2026-10-13-hello-world-cover.jpg
```

**分类中文名 → 目录英文名对照**：

| 中文分类 | 目录名 |
| --- | --- |
| 网络安全 | `cybersecurity` |
| 信息搜集 | `information-gathering` |
| 漏洞挖掘 | `vulnerability-research` |
| 日常随笔 | `daily-notes` |

**新增分类时**：先在 `_posts` 和 `_attach` 下建同名英文目录，再在文章 front-matter 的 `categories` 里填中文分类名。两者要对应。

**注意**：目录名**不能以下划线开头**（会被 Hexo 忽略），也**不要用中文**（URL 会被编码成一长串）。

### 分类显示顺序

左侧栏「分类」的一级分类不按名称排序，而是按固定顺序显示：

| 顺序 | 一级分类 |
| --- | --- |
| 1 | 网络安全 |
| 2 | 日常随笔 |

顺序在 `_config.icarus.yml` 的 categories widget 的 `customOrder` 中配置：

```yaml
        customOrder:
            - 网络安全
            - 日常随笔
```

该选项由 `themes/icarus/layout/widget/categories.jsx` 读取（覆盖主题默认的按名称排序）。

**规则**：

- 数组里的名字必须与 front-matter 的 `categories` 中文名**完全一致**，写错不会报错，只是该分类不参与排序
- **新分类未列入数组时自动排在最后**，不影响已定顺序；需要固定位置时把名字插进数组
- 未列出的分类之间、以及所有子分类（如「漏洞挖掘」）仍按名称升序排列
- 调整顺序属于站点配置改动，同样走 `dev-fix` → PR 流程

### URL 与目录的关系

`permalink` 为 `:title/`，而 `:title` 是**相对 `_posts` 的完整路径**——所以目录层级会直接出现在 URL 中：

```
source/_posts/cybersecurity/vulnerability-research/2026-10-15-what-is-immunefi.md
  → https://funlew.github.io/cybersecurity/vulnerability-research/2026-10-15-what-is-immunefi/
```

**移动文章到其他分类目录会改变 URL**，已有的外部链接会失效。若某篇文章需要固定 URL，可在 front-matter 里单独指定：

```yaml
permalink: /2026-10-15-what-is-immunefi/
```

### 为什么目录名带下划线

Hexo 默认忽略所有以 `_` 开头的文件和目录。这些目录通过 `_config.yml` 的 `include` 字段显式放行：

```100:104:../_config.yml
include:
  - _about/**
  - _attach/**
  - _static/**
```

**注意**：如果新增了以下划线开头的目录，必须同步在 `include` 里加一条，否则里面的内容不会被渲染。同理，非下划线目录会被 Hexo 当作文章处理。

---

## 三、创建文章

用命令生成骨架，避免手写 front-matter 出错。**用 `--path` 直接指定分类目录**：

```bash
npx hexo new "文章标题" --path cybersecurity/vulnerability-research/my-new-post
```

会在 `source/_posts/cybersecurity/vulnerability-research/my-new-post.md` 生成基于 `scaffolds/post.md` 的模板：

```yaml
---
title: 我的新文章
date: 2026-10-14 21:30:00
tags:
---
```

**注意**：默认的 `hexo new "标题"` 会把文件建在 `source/_posts/` 根目录下（不带分类目录）——生成后要么手动移到正确目录，要么直接用上面的 `--path` 参数。目录要用分类的英文名，见上一节的对照表。

### 文件、封面与链接命名

博客统一使用 `YYYY-MM-DD-slug` 命名格式，便于追溯，也使 URL 干净无重复。

**文件命名**

| 文件 | 格式 | 示例 |
| --- | --- | --- |
| 文章 | `YYYY-MM-DD-slug.md` | `2026-10-15-what-is-immunefi.md` |
| 封面 | `YYYY-MM-DD-slug-cover.jpg` | `2026-10-15-what-is-immunefi-cover.jpg` |

- `YYYY-MM-DD` 为发布日期，对应 front-matter 的 `date` 字段
- `slug` 为英文小写加短横线，与文章主题对应（不是中文标题）
- 同一篇文章的封面图命名：`<文章文件名去掉 .md>-cover.<扩展名>`

**URL 格式**

`_config.yml` 中 `permalink: :title/`——`:title` 是**相对 `_posts` 的完整路径**（含分类目录），所以 URL 会带上分类层级：

```
source/_posts/cybersecurity/vulnerability-research/2026-10-15-what-is-immunefi.md
                   ↓
URL: /cybersecurity/vulnerability-research/2026-10-15-what-is-immunefi/
```

**为什么这样**

- 文件名带日期前缀：一眼看出发布日期，避免多篇同主题文章混淆
- URL 带分类路径：链接自带分类语义，从地址就能看出文章归属
- 不用 `/YYYY/MM/DD/` 中间层：URL 不会出现「2026-10-15/2026-10-15-...」的日期重复
- 封面与文章 slug 保持一致：通过文件名前缀就能在 `_attach` 的对应分类目录下找到封面

**front-matter 引用**

封面字段的路径要与 `_attach` 下的分类目录一致：

```yaml
cover: /_attach/cybersecurity/vulnerability-research/2026-10-15-what-is-immunefi-cover.jpg
thumbnail: /_attach/cybersecurity/vulnerability-research/2026-10-15-what-is-immunefi-cover.jpg
```

封面图放在 `_attach` 的分类目录下，由 `_config.yml` 的 `include: - _attach/**` 放行，原样复制到 `public/_attach/`。

**slug 命名建议**

- 优先复用文章核心主题词，例如 `email-takeover-race-condition`、`subdomain-enumeration-asset-discovery`
- 不要用中文 slug（hexo 会 URL 编码，链接变长且难读）
- 多篇文章主题相近时，可在 slug 末尾加修饰词避免冲突，例如 `xxx-intro`、`xxx-deep-dive`
- 如果未来调整 permalink 格式，记得同步更新 README 的文章索引

---

## 四、编写 front-matter

完整示例：

```yaml
---
title: 我的文章标题
date: 2026-10-14 21:30:00
author: funlew
categories:
  - 技术
tags:
  - Hexo
  - 前端
cover: /_attach/my-cover.jpg
thumbnail: /_attach/my-thumb.jpg
top: false
---
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题。首页列表和文章页大标题都用它 |
| `date` | 是 | 发布时间，格式 `YYYY-MM-DD HH:mm:ss`。影响永久链接、排序、RSS |
| `categories` | 否 | 分类数组，展示在文章页头部并生成 `/categories/` 页面。层级写法见下方「层级分类」 |
| `tags` | 否 | 标签数组，生成 `/tags/` 页面 |
| `author` | 否 | 不填则取站点配置的 `funlew` |
| `cover` | 否 | 首页列表的 7:3 大封面图，不填则无图 |
| `thumbnail` | 否 | 右栏「最新文章」组件的 48×48 缩略图，不填则该条目无图 |
| `top` | 否 | `true` 时置顶，标题前显示图钉图标 |
| `updated` | 否 | 与 `date` 不同时，文章页额外显示更新时间 |
| `permalink` | 否 | 覆盖默认永久链接，独立页面常用（参考 `source/_about/index.md`） |
| `toc` | 否 | 是否显示左栏目录组件。站点默认开启（`_config.yml` 的 `toc: true`），页面写 `toc: false` 可单独关闭（双语页面必须关，见「双语页面（关于页）」） |

`cover` 和 `thumbnail` 是两个独立字段，引用同一张图也可以。

### 层级分类

分类最多支持三层（侧栏「分类」组件的默认深度）。二级分类要写成**数组对**，而不是嵌套对象：

```yaml
categories:
  - [网络安全, 赏金SRC]
  - [网络安全, 信息搜集]
```

渲染效果是「网络安全」下挂「赏金SRC」和「信息搜集」，父分类的计数为层级条目数。

**不要用嵌套对象**，那样分类名会变成字面量 `[object Object]`，并且在站点上生成一个名为 `categories/object-Object/` 的可用页面：

```yaml
# 错误
categories:
  - 网络安全:
      - 赏金SRC
```

原因是 Hexo 解析 `categories` 时只对数组走层级分支，其余取值一律按字符串处理（`hexo/dist/plugins/processor/post.js`）：

```js
cats = cats.filter(cat => {
    return Array.isArray(cat) || (cat != null && cat !== '');
}).map(cat => {
    return Array.isArray(cat) ? removeEmptyTag(cat) : `${cat}`;
});
```

对象落到 `` `${cat}` `` 上就被字符串化了。本站的「网络安全 / 赏金SRC / 信息搜集」即按上面的数组对写法预留，写第一篇相关文章时填进去，左侧就会出现该层级。

**分类由文章驱动**：没有任何文章使用的分类不会出现在侧栏，所以建分类的实质是给文章挂分类，而不是单独创建。一级分类在侧栏中的显示顺序是固定的（网络安全 → 日常随笔），配置方式见「二、目录约定」中的「分类显示顺序」。

---

## 五、编写正文

### 摘要分隔

首页只显示摘要部分，用 `<!-- more -->` 分割，其后内容仅在文章页显示：

```markdown
这里是首页会显示的摘要内容……

<!-- more -->

这里是完整正文。
```

未写 `<!-- more -->` 时，Hexo 自动截取前 110 个字符作为摘要。

### 代码高亮

已启用 highlight.js（主题 `atom-one-light`，带行号与复制按钮，不折叠）。使用标准 fenced code block：

````markdown
```js
const answer = 42;
```
````

指定语言才会触发高亮（`highlight.auto_detect: false`），不写语言标识则按纯文本处理。

### 数学公式

**暂不支持**。`_config.icarus.yml` 中 `katex: false` 且 `mathjax: false`。如需公式渲染，要先开启其中之一：

```yaml
plugins:
    katex: true      # 或 mathjax: true
```

### 目录

站点级 `toc: true`，左栏会自动生成目录，深度为 3 级。正文用 `##` / `###` 分级即可，超出 3 级不会出现在目录中。

### 图片

`post_asset_folder: false`，不能用相对路径引用同目录图片。统一用站点绝对路径：

```markdown
![描述](/_attach/my-image.png)
```

外链图片会自动以新标签页打开（`external_link.enable: true`，全站生效）。

### 嵌入 HTML 报告内容

如果原素材是一份带样式 / 表格 / 交互图表的 HTML 报告，可以保留这些视觉资产内联进 .md。流程与规则：

**何时考虑嵌入**

- 报告里有 markdown 难以表达的元素（高亮分组、紧凑数据表、hover tooltip、动态图表等）
- 你希望保留原报告的视觉特征（颜色编码、分组行、气泡尺寸等）
- 不愿为每张图单独生成静态截图

**嵌入范围选择**

按"原样搬多少 HTML 进 .md"分三档：

| 档位 | 说明 | 适用 |
| --- | --- | --- |
| 轻量嵌入 | 只保留关键图表（ECharts 等），主体用 markdown | 文字多、图少 |
| 表格嵌入（推荐） | 把带高亮的表格原样搬过来，文字叙述仍用 markdown | 报告型文章 |
| 完整嵌入 | 把整份 HTML 内联，markdown 仅做引言 / 摘要 | 设计型展示页 |

**实施规则**

1. **CDN 资源**：ECharts / Chart.js 等用 `<script src="https://cdn.jsdelivr.net/...">` 引入；本地资源放 `source/_static/` 或 `source/_attach/`，引用用绝对路径 `/_attach/...`。

2. **CSS 命名空间**：报告里的通用类名（`.card`、`.kpi`、`.tw`、`.charts` 等）会和 Icarus 主题冲突。**所有类名加文章专属前缀**（例：`.agri-`），**CSS 变量**（`var(--card)`、`var(--ink2)` 等）也要在容器内重定义（Icarus 主题不提供这些变量）。在文章正文用 `<style>` 块定义——marked 7.x 默认原样保留 `<style>` 标签。

3. **JS 作用域**：报告里 `var scatA = [...]` 这种顶层声明会污染 `window`。**用 IIFE 包裹**：

   ```js
   (function() {
     var scatA = [...];
     echarts.init(document.getElementById("agri-chart1")).setOption({...});
   })();
   ```

4. **加载顺序**：`<script src="...echarts.min.js">` 放在 `<script>...IIFE...</script>` 之前。如果用 `head_end` 注入器，CDN 加载会先于文章体内的 IIFE。

5. **避免解析副作用**：模板字符串里的 `{{ }}` 会被某些 ejs 主题处理（hexo 默认不会但要避开），`<style>` 块里不要用 HTML 实体转义字符。

**SEO 注意点**

- 嵌入式 `<style>` 块应保持简洁，**不要写大段非必要 CSS**
- ECharts 容器不要加 `display: none` 等隐藏样式，否则搜索引擎会跳过
- 表格保留语义化标签（`<thead>`、`<tbody>`、`<th>`、`<td>`），不要全用 `<div>` 模拟
- 图表配上下文说明文字（`agri-note` 之类的 div），让搜索引擎理解图表含义
- markdown 摘要（`<!-- more -->` 之前）保持纯 markdown，让首页 / RSS 抓取正常

---

## 六、本地预览

```bash
npm run server
```

打开 http://localhost:4000 检查效果。修改 `source/` 下的文件后会自动热更新。

**预览时若页面显示异常**（尤其是改了 front-matter、依赖或主题后），清缓存重启：

```bash
npm run clean && npm run server
```

预览确认无误后建议再跑一次完整构建，验证生产环境无报错：

```bash
npm run clean && npm run build
```

---

## 七、发布

文章先提交到工作分支 `dev-fix`（仓库规则禁止直推 `main`）：

```bash
git checkout dev-fix
git add source/_posts/我的新文章.md source/_attach/my-cover.jpg
git commit -m "post: add 我的新文章"
git push
```

推送后打开 https://github.com/funlew/funlew.github.io/compare/main...dev-fix 创建 Pull Request，合并到 `main` 即触发部署。

部署流程（`.github/workflows/deploy.yml`）：

```
合并进 main → npm ci → hexo clean && hexo generate → 上传 public/ → 部署到 GitHub Pages
```

通常 1～2 分钟完成。访问 `https://funlew.github.io` 确认；仓库 **Actions** 标签页可查看构建日志，若 Pages 未更新，在 **Settings → Pages** 中确认 Source 为 **GitHub Actions**。

也支持在 Actions 页面手动触发 `workflow_dispatch`。分支模型与回滚方式详见 [开发流程](./_development-workflow.md)。

---

## 八、发布检查清单

提交前逐项确认：

- [ ] 本地 `npm run server` 预览无异常
- [ ] `npm run clean && npm run build` 构建无报错
- [ ] 文件名为英文短横线，链接美观
- [ ] **文章放在正确的分类目录**——`source/_posts/<分类英文目录>/` 下，层级与 `categories` 一致
- [ ] **封面放在对应的分类目录**——`source/_attach/<相同分类路径>/`，且 `cover` / `thumbnail` 字段的路径与之一致
- [ ] `categories` / `tags` 无拼写错误（错字会生成新的分类页）
- [ ] **新分类的显示顺序已处理**——未列入 `customOrder` 的分类会排在侧栏最后，需要固定位置时把名字加入 `_config.icarus.yml`（见「分类显示顺序」）
- [ ] 图片文件名全小写，避免部署到 Linux 后 404
- [ ] **README 文章索引已同步**——新增 / 重命名 / 改分类 / 改标题 / **改目录** 后，`README.md` 的「📰 最新文章」表格同步更新（按发布时间倒序，标题 / **链接 URL** / 分类都要对得上）
- [ ] **SEO 标题**——含核心搜索关键词、长度 15-30 字、保留发布时间或数量感等有信息量的修饰
- [ ] **嵌入 HTML 报告**（如有）——CSS 类名加文章专属前缀、JS 用 IIFE 包裹、ECharts/Chart.js 等 CDN 放在 IIFE 之前、CSS 变量（`var(--card)` 等）在容器内重定义（Icarus 主题不提供）
- [ ] **commit / push 分开**——本地 `git commit` 可以自由做，`git push` 等显式命令（避免误推）

---

## 九、需要注意的行为

- **未来时间的文章会被发布**。`_config.yml` 中 `future: true`，`date` 写未来日期也会立刻上线。
- **草稿不会被发布**。`render_drafts: false`，文件名以 `_` 开头或 front-matter 中 `draft: true` 的文章只在本地显示（需 `hexo server --draft` 才可见）。
- **RSS 只输出最近 20 篇**（`feed.limit: 20`），旧文章不会出现在 `/atom.xml` 中，但归档页可完整浏览。
- **首页分页为每页 10 篇**（`index_generator.per_page: 10`）。
- **评论功能当前未启用**。`_config.icarus.yml` 中没有 `comment` 配置，主题不会渲染评论区。若要开启，需配置 giscus / waline / valine 等任一 provider 并安装对应依赖。
- **修改已发布文章需重新 push**。没有构建缓存，增删改都会触发完整重新部署。
- **主题源码纳入版本管理**（`themes/icarus/`，非 submodule）。主题升级需手动比对上游，改动前建议先备份。

### 待处理的依赖升级

`.github/dependabot.yml` 每日检查 npm 更新，目前存在若干待合并的大版本升级分支：`inferno` 8 → 10、`hexo-util` 3 → 4、`hexo-pagination` 3 → 4、`bulma-stylus` 0.8 → 0.9。

其中 **inferno 8 → 10 风险最高**，主题 JSX 渲染依赖它。合并前务必在本地跑一次 `npm run clean && npm run build` 验证构建结果。
