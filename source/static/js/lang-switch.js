/*!
 * UI language switcher (zh-CN <-> en) for this blog.
 *
 * Every interface text is rendered in Chinese at build time (site language
 * is zh-CN), so switching to English rewrites the matching text nodes and
 * attributes in place. The choice is stored in localStorage and can be
 * forced with "?lang=en" / "?lang=zh-CN" in the URL.
 *
 * Article content (.content) and dynamic areas (search results, comments)
 * are never touched.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'funlew-ui-lang';
    var ZH = 'zh-CN';
    var EN = 'en';

    /* Chinese -> English, matched against a whole text node / attribute value */
    var DICT = {
        '主页': 'Home',
        '归档': 'Archives',
        '分类': 'Categories',
        '标签': 'Tags',
        '关于': 'About',
        '文章': 'Posts',
        '页面': 'Pages',
        '上一页': 'Previous',
        '下一页': 'Next',
        '关注我': 'Follow',
        '最新文章': 'Recents',
        '链接': 'Links',
        '目录': 'Catalogue',
        '订阅更新': 'Subscribe for updates',
        '订阅': 'Subscribe',
        '广告': 'Advertisement',
        '阅读更多': 'Read more',
        '评论': 'Comments',
        '复制': 'Copy',
        '已复制！': 'Copied!',
        '作者': 'Author',
        '发布于': 'Posted on',
        '更新于': 'Updated on',
        '许可协议': 'Licensed under',
        '回到顶端': 'Back to top',
        '搜索': 'Search',
        '想要查找什么...': 'Type something...',
        '未找到搜索结果': 'No results for',
        '(无标题)': '(Untitled)',
        '(无内容预览)': '(No preview)',
        '语言': 'Language',
        '发表': 'Posted',
        '更新': 'Updated',
        '微博': 'Weibo',
        '知乎': 'Zhihu',
        '抖音': 'Douyin',
        '简书': 'Jianshu',
        '掘金': 'Juejin',
        '豆瓣': 'Douban',
        '小红书': 'Xiaohongshu'
    };

    var MONTHS = {
        '一月': 'January', '二月': 'February', '三月': 'March', '四月': 'April',
        '五月': 'May', '六月': 'June', '七月': 'July', '八月': 'August',
        '九月': 'September', '十月': 'October', '十一月': 'November', '十二月': 'December'
    };

    var DURATIONS = {
        '几秒': 'a few seconds', '一分钟': 'a minute', '几分钟': 'a few minutes',
        '一小时': 'an hour', '一个小时': 'an hour', '几小时': 'a few hours', '一天': 'a day'
    };

    /* Chinese pattern -> English, for texts that contain values */
    var PATTERNS = [
        [/^(.+?)\s*发表$/, function (m) { return 'Posted ' + m[1]; }],
        [/^(.+?)\s*更新$/, function (m) { return 'Updated ' + m[1]; }],
        [/^(.+?)\s*读完\s*[（(]大约\s*(\d+)\s*个字[）)]$/, function (m) {
            return humanizeDuration(m[1]) + ' read (About ' + m[2] + ' words)';
        }],
        [/^(.+?)\s*读完$/, function (m) { return humanizeDuration(m[1]) + ' read'; }],
        [/^大约\s*(\d+)\s*个字$/, function (m) { return 'About ' + m[1] + ' words'; }],
        [/^(一月|二月|三月|四月|五月|六月|七月|八月|九月|十月|十一月|十二月)\s*(\d{4})$/, function (m) {
            return MONTHS[m[1]] + ' ' + m[2];
        }],
        /* Relative dates produced by moment.js (e.g. "1小时前") */
        [/^几秒前$/, function () { return 'a few seconds ago'; }],
        [/^(\d+)\s*秒前$/, function (m) { return m[1] + ' seconds ago'; }],
        [/^(\d+)\s*分钟前$/, function (m) { return m[1] + ' minutes ago'; }],
        [/^(\d+)\s*小时前$/, function (m) { return m[1] + ' hours ago'; }],
        [/^(\d+)\s*天前$/, function (m) { return m[1] + ' days ago'; }],
        [/^(\d+)\s*周前$/, function (m) { return m[1] + ' weeks ago'; }],
        [/^(\d+)\s*个月前$/, function (m) { return m[1] + ' months ago'; }],
        [/^(\d+)\s*年前$/, function (m) { return m[1] + ' years ago'; }]
    ];

    var SKIP_SELECTOR = '.content, .searchbox-body, #comments, pre, code';
    var ATTRS = ['title', 'aria-label', 'placeholder'];

    var records = [];
    var origTitle = '';
    var lang = readLang();

    function humanizeDuration(text) {
        var t = text.trim();
        if (DURATIONS[t]) {
            return DURATIONS[t];
        }
        var m = t.match(/^(\d+)\s*分钟$/);
        if (m) {
            return m[1] + ' minutes';
        }
        m = t.match(/^(\d+)\s*小时$/);
        if (m) {
            return m[1] + ' hours';
        }
        m = t.match(/^(\d+)\s*天$/);
        if (m) {
            return m[1] + ' days';
        }
        return t;
    }

    function toEnglish(text) {
        var t = text.trim();
        if (!t) {
            return null;
        }
        if (Object.prototype.hasOwnProperty.call(DICT, t)) {
            return DICT[t];
        }
        for (var i = 0; i < PATTERNS.length; i++) {
            var m = t.match(PATTERNS[i][0]);
            if (m) {
                var result = PATTERNS[i][1](m);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    function readLang() {
        try {
            var query = new URLSearchParams(window.location.search).get('lang');
            if (query) {
                var lower = query.toLowerCase();
                if (lower === 'en') {
                    writeLang(EN);
                    return EN;
                }
                if (lower.indexOf('zh') === 0) {
                    writeLang(ZH);
                    return ZH;
                }
            }
        } catch (e) { /* ignore */ }
        try {
            return window.localStorage.getItem(STORAGE_KEY) === EN ? EN : ZH;
        } catch (e) {
            return ZH;
        }
    }

    function writeLang(value) {
        try {
            window.localStorage.setItem(STORAGE_KEY, value);
        } catch (e) { /* ignore */ }
    }

    /* The created/updated date label is rendered as "<time>date</time>发表",
       English wants the label in front of the date. */
    function previousTimeElement(node) {
        var prev = node.previousSibling;
        while (prev && prev.nodeType === 3 && !prev.nodeValue.trim()) {
            prev = prev.previousSibling;
        }
        if (prev && prev.nodeType === 1 && prev.tagName.toLowerCase() === 'time') {
            return prev;
        }
        return null;
    }

    function collect() {
        records = [];
        origTitle = document.title;

        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                var value = node.nodeValue;
                if (!value || !value.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }
                var parent = node.parentNode;
                if (!parent || !parent.closest || parent.closest(SKIP_SELECTOR)) {
                    return NodeFilter.FILTER_REJECT;
                }
                return toEnglish(value) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });

        var node;
        while ((node = walker.nextNode())) {
            var value = node.nodeValue;
            var trimmed = value.trim();
            var start = value.indexOf(trimmed);
            records.push({
                node: node,
                orig: value,
                prefix: value.slice(0, start),
                suffix: value.slice(start + trimmed.length),
                en: toEnglish(trimmed),
                timeEl: previousTimeElement(node)
            });
        }

        var elements = document.body.querySelectorAll('[title], [aria-label], [placeholder]');
        Array.prototype.forEach.call(elements, function (el) {
            if (el.closest && el.closest(SKIP_SELECTOR)) {
                return;
            }
            ATTRS.forEach(function (attr) {
                var value = el.getAttribute(attr);
                if (!value) {
                    return;
                }
                var en = toEnglish(value);
                if (en) {
                    records.push({ el: el, attr: attr, orig: value, en: en });
                }
            });
        });
    }

    function translateTitle(title) {
        var m = title.match(/^(.+?)\s+-\s+(.+)$/);
        if (m && Object.prototype.hasOwnProperty.call(DICT, m[1].trim())) {
            return DICT[m[1].trim()] + ' - ' + m[2];
        }
        return title;
    }

    function apply() {
        var english = lang === EN;

        records.forEach(function (r) {
            if (r.node) {
                if (!english) {
                    r.node.nodeValue = r.orig;
                    if (r.timeEl && r.timeEl.parentNode) {
                        r.timeEl.parentNode.appendChild(r.node);
                    }
                    return;
                }
                if (r.timeEl && r.timeEl.parentNode) {
                    r.node.nodeValue = r.en + ' ';
                    r.timeEl.parentNode.insertBefore(r.node, r.timeEl);
                } else {
                    r.node.nodeValue = r.prefix + r.en + r.suffix;
                }
            } else if (r.el && r.el.setAttribute) {
                r.el.setAttribute(r.attr, english ? r.en : r.orig);
            }
        });

        document.title = english ? translateTitle(origTitle) : origTitle;
        document.documentElement.setAttribute('lang', english ? 'en' : ZH);
    }

    function refresh() {
        collect();
        apply();
    }

    function setLang(value) {
        lang = value;
        writeLang(value);
        apply();
    }

    /* The switch button is a navbar link with the language icon,
       bound through event delegation so PJAX replacements keep working. */
    document.addEventListener('click', function (event) {
        var target = event.target;
        var link = target && target.closest ? target.closest('a.navbar-item') : null;
        if (!link || !link.querySelector || !link.querySelector('i.fa-language')) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        setLang(lang === EN ? ZH : EN);
    }, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', refresh);
    } else {
        refresh();
    }
    document.addEventListener('pjax:complete', refresh);
}());
