---
title: 关于
title_en: About
date: 2026-10-13 22:40:00
permalink: /about/
comment: false
---

<!--
关于页是中英双语的：每个语种占一个 lang-block，front matter 里的英文标题写在
title_en 里。构建时由 tools/prepare-i18n.mjs 只保留当前语言的那一块，所以
/zh/about/ 只有中文、/en/about/ 只有英文，两个地址各自是完整页面。导航栏的语言
按钮（source/_static/js/language-switch.js）打开的是本页的另一种语言版本。

新增语种时：复制一个 lang-block 改 data-lang，再补上对应的 title_en 即可。
-->

<div class="lang-block" data-lang="zh-CN" lang="zh-CN">

## 关于我

你好，我是 **funlew**，欢迎来到我的个人博客。

这里记录我在技术、开源与生活方面的思考与实践，主要关注：

- 编程语言与工程实践
- 开源项目与工具链
- 阅读与生活随笔

如果想进一步交流，欢迎通过 [GitHub](https://github.com/funlew) 找到我。

</div>

<div class="lang-block" data-lang="en" lang="en">

## About Me

Hi, I'm **funlew**. Welcome to my personal blog.

This is where I write down my thoughts and practice around technology, open source and everyday life. I mainly focus on:

- Programming languages and engineering practice
- Open source projects and toolchains
- Reading and everyday notes

If you want to get in touch, you can find me on [GitHub](https://github.com/funlew).

</div>
