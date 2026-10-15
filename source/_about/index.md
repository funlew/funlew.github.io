---
title: 关于
date: 2026-10-13 22:40:00
permalink: /about/
comment: false
# 页面的 front-matter 会并入主题配置，所以 toc: false 只作用在本页。
# 目录组件按正文里的全部标题在构建期生成，双语的二级标题（关于我 / About Me）
# 会各占一条，因此这里关闭目录（站点默认 toc: true）。详见 docs/_publishing-guide.md。
toc: false
---

<!--
关于页是中英双语的：每个语种写在一个 data-lang 块里，样式表
（source/_static/css/i18n.css）按 <html lang> 只显示当前语言的那一块。
界面语言由导航栏的语言按钮切换（source/_static/js/lang-switch.js），
它会把 <html lang> 同步成 en / zh-CN，两个块随之切换。

新增语种时：复制一个 .lang-block 并改 data-lang 即可，不用改脚本。
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
