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
| `source/_posts/` | 文章正文所在目录，**文件名会成为永久链接** |
| `source/_attach/` | 文章配图（封面图、插图） |
| `source/_static/` | 站点级静态资源：favicon、头像、自定义 CSS/JS |
| `source/_about/` | 关于页等独立页面 |

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

用命令生成骨架，避免手写 front-matter 出错：

```bash
npx hexo new "我的新文章"
```

会在 `source/_posts/我的新文章.md` 生成基于 `scaffolds/post.md` 的模板：

```yaml
---
title: 我的新文章
date: 2026-10-14 21:30:00
tags:
---
```

### 关于文件名与链接

`_config.yml` 中 `new_post_name: :title.md`，即文件名直接取命令中的标题原文。默认永久链接为：

```17:18:../_config.yml
permalink: :year/:month/:day/:title/
permalink_defaults:
```

所以 `source/_posts/我的新文章.md` 发布后的地址是：

```
https://funlew.github.io/2026/10/14/我的新文章/
```

中文会被 URL 编码，链接不够美观。**建议**：文件名改用英文短横线命名（如 `my-new-post.md`），标题仍写中文，这样链接是 `/2026/10/14/my-new-post/`。如需完全自定义，可用 front-matter 的 `permalink` 字段覆盖。

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

**分类由文章驱动**：没有任何文章使用的分类不会出现在侧栏，所以建分类的实质是给文章挂分类，而不是单独创建。

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
- [ ] `cover` 图片已上传到 `source/_attach/` 并在正文中用绝对路径引用
- [ ] `categories` / `tags` 无拼写错误（错字会生成新的分类页）
- [ ] 图片文件名全小写，避免部署到 Linux 后 404

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
