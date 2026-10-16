# 变更记录

记录待处理的改进建议与已完成的变更。每个条目一个独立章节，标题用记录当时的 `年-月-日-时-分-秒`，最新的排在最上面。

---

## 2026-10-16-12-12-33

### 正文字体栈跨平台优化（待处理）

**现状**

主题正文字体由 `themes/icarus/include/style/base.styl` 第 11 行定义，是 Bulma 变量的覆盖（`?=` 可被上游覆盖）：

```stylus
$family-sans-serif ?= Ubuntu, Roboto, 'Open Sans', 'Microsoft YaHei', sans-serif
```

编译后在 `default.css` 里作用于 `body, button, input, select, textarea`。`.article` 与 `.content` 没有单独声明，直接继承 body。

主题变体配置 `variant: default`，因此生效的是 `default.css`；`cyberpunk.css` 虽然也会生成但不被引用。

**问题**

这个字体栈的排列顺序偏向 Linux——第一位的 Ubuntu 在 Windows 和 macOS 上都不存在：

| 平台 | 命中情况 | 实际字体 |
| --- | --- | --- |
| Linux | Ubuntu ✓ | Ubuntu |
| Windows | 前三个都缺失 | 微软雅黑（Microsoft YaHei） |
| macOS | 前四个都缺失 | `sans-serif` 兜底 → 系统默认（PingFang SC / Helvetica Neue） |

后果是 macOS 用户拿不到显式声明的中文字体，完全依赖浏览器对 `sans-serif` 的解析；三个平台的中英文字体配对也不统一。

**建议**

改为平台优先的字体栈，让每个系统都命中自己最优的中英文字体组合：

```stylus
$family-sans-serif ?= -apple-system, BlinkMacSystemFont, 'Segoe UI', Ubuntu, Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', sans-serif
```

对照效果：

| 平台 | 西文 | 中文 |
| --- | --- | --- |
| macOS | `-apple-system`（San Francisco） | PingFang SC |
| Windows | `Segoe UI` | 微软雅黑 |
| Linux | Ubuntu / Roboto | Noto Sans CJK SC |

代码块字体（`$family-code`）可一并调整：

```stylus
$family-code ?= 'SF Mono', 'Cascadia Code', 'Source Code Pro', Consolas, Menlo, monospace, 'PingFang SC', 'Microsoft YaHei'
```

**影响文件**

- `themes/icarus/include/style/base.styl`（改两个变量）
- 改完需重新构建，让 `default.css` 与 `cyberpunk.css` 重新编译

**注意**

- `themes/` 是纳入版本管理的 vendored 主题源码，升级主题时要和上游比对，这个改动会被 diff 出来。
- 主题目录已在 `.gitattributes` 中标记为 `-text`（不做行尾规范化），但**不影响**正常编辑与提交。
- 验证方式：构建后检查 `public/zh/css/default.css` 里的 `font-family` 声明，并在三个平台的浏览器里目视确认中文与西文的渲染效果。

**状态**：未处理

---
