/*
 * Bilingual build support, loaded by both site builds (Chinese and English).
 *
 * Two things are language specific but cannot be expressed in the content:
 *
 * 1. The theme UI text. The navbar menu, the widget entries and the social link
 *    names are plain values of _config.icarus.yml, not theme translations, so
 *    the English wording is listed in the "i18n_theme" section of
 *    config/_config.en.yml and applied here on top of the merged theme configuration.
 * 2. The hreflang alternates. tools/prepare-i18n.mjs writes _data/i18n.json
 *    with, for every page of this build, the matching page of the other
 *    language (null when the page has no translation) plus the category and tag
 *    slug pairs. The two helpers below turn that into
 *    <link rel="alternate" hreflang="…"> tags (emitted by the theme's head
 *    layout) and tell the language switch button where to go.
 *
 * See docs/_publishing-guide.md for the whole picture.
 */
const fs = require('fs');
const path = require('path');

const LANG_TAGS = { zh: 'zh-CN', en: 'en' };

/**
 * The _data/i18n.json written by tools/prepare-i18n.mjs.
 *
 * Read on every call on purpose: the preview server keeps this module in
 * memory while tools/prepare-i18n.mjs rewrites the file whenever the content
 * changes, so a cached copy would stay stale until the next restart.
 */
function i18nMap() {
    const file = path.join(hexo.source_dir, '_data', 'i18n.json');
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** Route path of this page → route path of the same page in the other language. */
function otherRoute(route, map) {
    if (Object.prototype.hasOwnProperty.call(map.paths, route)) {
        return map.paths[route];
    }
    // Category and tag pages: their path holds the slugs of the names, which are
    // translated per language. A taxonomy the other build does not have is a
    // name that no translated post uses yet, so there is nothing to link to.
    const taxonomy = route.match(/^(categories|tags)\/(.+)\//);
    if (taxonomy) {
        const slugs = map[taxonomy[1]] || {};
        const names = taxonomy[2].split('/');
        const translated = names.map(name => slugs[name] || slugs[decodeURIComponent(name)]);
        return names.length && translated.every(Boolean) ? `${taxonomy[1]}/${translated.join('/')}/` : null;
    }
    // Everything else (home, pagination, archives) exists in both builds.
    return route;
}

/** Route path → URL inside one of the two sites. */
function urlOf(route, root) {
    return encodeURI(route === 'index.html' ? root : root + route.replace(/index\.html$/, ''));
}

/**
 * The hreflang alternates of a page: itself, its translation when there is one,
 * and the language selection page at the site root.
 *
 * "href" is absolute because that is what hreflang wants, "path" is the same
 * page without the domain, for the language switch button: a reader who is
 * reading a preview of the site still lands on the page in front of them.
 *
 * @param {Object} page Page locals (what locals.path does not already tell)
 * @returns {Array<{lang: string, href: string, path?: string}>}
 */
function i18nAlternates(page) {
    const map = i18nMap();
    const base = hexo.config.url;
    // Route path of the route being rendered: locals.path is set for posts,
    // pages, taxonomies and listings alike (page.path holds the source path for
    // posts, hence the preference), page.path is the fallback for callers that
    // have no locals at hand.
    const route = String((this && this.path) || (page && page.path) || '').replace(/^\/+/, '');
    const tags = [{ lang: LANG_TAGS[map.lang], href: new URL(urlOf(route, map.root), base).href }];
    const other = route.endsWith('.html') ? otherRoute(route, map) : null;
    if (other !== null) {
        const otherPath = urlOf(other, map.otherRoot);
        tags.push({ lang: LANG_TAGS[map.other], href: new URL(otherPath, base).href, path: otherPath });
        tags.push({ lang: 'x-default', href: new URL('/', base).href });
    }
    return tags;
}

/** Where the language switch button goes when a page has no translation. */
function i18nHome() {
    return i18nMap().otherRoot;
}

hexo.extend.helper.register('i18n_alternates', i18nAlternates);
hexo.extend.helper.register('i18n_home', i18nHome);

/**
 * Replace the theme UI text with the wording of this language.
 *
 * Sections such as "navbar" are taken over as a whole (the English menu lists
 * its own entries, it does not extend the Chinese one), widgets are addressed by
 * type so that only the wording changes and their position stays.
 */
function applyThemeText(config, overrides) {
    for (const [key, value] of Object.entries(overrides)) {
        if (key !== 'widgets') {
            config[key] = value;
        }
    }
    if (Array.isArray(config.widgets) && overrides.widgets) {
        for (const [type, fields] of Object.entries(overrides.widgets)) {
            config.widgets
                .filter(widget => widget && widget.type === type)
                .forEach(widget => Object.assign(widget, fields));
        }
    }
}

// Runs after the filter of the theme that merges the theme config into the page
// locals (default priority), so the overrides win.
hexo.extend.filter.register('template_locals', locals => {
    const overrides = locals.config && locals.config.i18n_theme;
    if (overrides && typeof overrides === 'object') {
        applyThemeText(locals.config, overrides);
    }
    return locals;
}, 20);
