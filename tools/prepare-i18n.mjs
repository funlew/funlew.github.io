#!/usr/bin/env node
/**
 * Prepare the per-language source trees used by the two site builds.
 *
 * The repository keeps ONE source of truth under source/: a post or a page may
 * carry the English version next to the Chinese one (title_en, categories_en,
 * tags_en and a "lang-block" section in the body, see
 * docs/_publishing-guide.md). Hexo cannot filter that per build, so this script
 * resolves the content first and writes one tree per language:
 *
 *   .build/zh/   source_dir of the Chinese build   → public/zh
 *   .build/en/   source_dir of the English build   → public/en
 *
 * Markdown files are rewritten (exactly one language per file), _attach and
 * _static are symlinked so images and site assets are not duplicated, and
 * _data/i18n.json tells each build how it maps onto the other one (used for the
 * hreflang alternates and by the language switch button, see scripts/i18n.js).
 *
 * A post/page without a language block is Chinese only: it lands in .build/zh
 * and is left out of .build/en until its English version is written.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const frontMatter = require('hexo-front-matter');
const { slugize } = require('hexo-util');
const yaml = require('hexo-component-inferno/lib/util/yaml');

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const SOURCE_DIR = path.join(ROOT, 'source');
const BUILD_DIR = path.join(ROOT, '.build');

/** Languages of the site, in the order they are listed in the report. */
const LANGS = ['zh', 'en'];
/** Where the language keys (root, public_dir, filename_case, maps) come from. */
const CONFIG_FILES = { zh: ['config/_config.zh.yml'], en: ['config/_config.zh.yml', 'config/_config.en.yml'] };
/** Language tag used in the "data-lang" attribute of a content block. */
const LANG_CODES = { zh: 'zh-CN', en: 'en' };
/** Directories whose markdown is rewritten per language; the rest is symlinked. */
const CONTENT_DIRS = ['_posts', '_about'];
/** Front matter keys of the English version → the key they replace. */
const EN_KEYS = {
    title_en: 'title',
    subtitle_en: 'subtitle',
    description_en: 'description',
    categories_en: 'categories',
    tags_en: 'tags'
};
/** A language block: <div class="lang-block" data-lang="en" lang="en"> … </div> */
const BLOCK_RE = /<div class="lang-block"[^>]*data-lang="([^"]+)"[^>]*>\n?([\s\S]*?)<\/div>/g;

function readConfig(lang) {
    const config = CONFIG_FILES[lang].reduce((result, file) => {
        const filePath = path.join(ROOT, file);
        return fs.existsSync(filePath) ? Object.assign(result, yaml.parse(fs.readFileSync(filePath, 'utf8'))) : result;
    }, {});
    return {
        lang,
        root: config.root || '/',
        filenameCase: config.filename_case || 0,
        categoryMap: config.category_map || {},
        tagMap: config.tag_map || {}
    };
}

/** The slug a category or tag gets in the URL of this build. */
function taxonomySlug(name, config, kind) {
    const map = kind === 'categories' ? config.categoryMap : config.tagMap;
    return slugize(map[name] || name, { transform: config.filenameCase });
}

/** Route path (as Hexo writes it) of a post or a page. */
function routePath(file, data) {
    const permalink = typeof data.permalink === 'string' ? data.permalink : null;
    if (permalink) {
        const clean = permalink.replace(/^\/+|\/+$/g, '');
        return clean ? `${clean}/index.html` : 'index.html';
    }
    const rel = file.replace(/\.md$/, '');
    if (rel.startsWith('_posts/')) {
        return `${rel.slice('_posts/'.length)}/index.html`;
    }
    return rel.endsWith('/index') ? `${rel}.html`.replace(/\/index\.html$/, '/index.html') : `${rel}.html`;
}

/** Split a body into its shared text and its per-language blocks. */
function splitBlocks(content) {
    const blocks = {};
    let shared = content;
    BLOCK_RE.lastIndex = 0;
    for (const match of content.matchAll(BLOCK_RE)) {
        blocks[match[1]] = match[2];
        shared = shared.replace(match[0], '');
    }
    return { blocks, shared: shared.replace(/\n{3,}/g, '\n\n').trim() };
}

/** The body of one language, or null when the file has no version of it. */
function bodyFor(content, lang) {
    const { blocks, shared } = splitBlocks(content);
    const codes = Object.keys(blocks);
    if (!codes.length) {
        return { body: content, translated: lang === 'zh' };
    }
    const own = blocks[LANG_CODES[lang]];
    if (own === undefined) {
        return { body: shared, translated: false };
    }
    const body = [shared, own.trim()].filter(Boolean).join('\n\n');
    return { body: body.endsWith('\n') ? body : body + '\n', translated: true };
}

/** Collect every markdown file of source/ with its front matter. */
function collectFiles() {
    const files = [];
    const walk = dir => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            } else {
                files.push(path.relative(SOURCE_DIR, full).split(path.sep).join('/'));
            }
        }
    };
    for (const dir of CONTENT_DIRS) {
        const full = path.join(SOURCE_DIR, dir);
        if (fs.existsSync(full)) {
            walk(full);
        }
    }
    return files;
}

/** Rewrite one markdown file for one language, or return null to skip it. */
function resolveFile(relPath, lang, warn) {
    const data = frontMatter.parse(fs.readFileSync(path.join(SOURCE_DIR, relPath), 'utf8'), {});
    const content = data._content || '';
    const { body, translated } = bodyFor(content, lang);
    if (lang === 'en' && !translated) {
        return null;
    }
    const resolved = Object.assign({}, data);
    if (lang === 'en') {
        for (const [enKey, key] of Object.entries(EN_KEYS)) {
            if (enKey in resolved) {
                resolved[key] = resolved[enKey];
            } else if (resolved[key] !== undefined) {
                warn(key === 'title'
                    ? `missing ${enKey}, falling back to the Chinese title`
                    : `missing ${enKey}, the English version gets no ${key}`);
            }
        }
    }
    for (const key of Object.keys(EN_KEYS)) {
        delete resolved[key];
    }
    resolved._content = body;
    return { data: resolved, text: frontMatter.stringify(resolved, { prefixSeparator: true }), route: routePath(relPath, data) };
}

/** Symlink an asset so that both trees share the original file. */
function link(target, linkPath) {
    if (fs.lstatSync(linkPath, { throwIfNoEntry: false })) {
        return;
    }
    fs.mkdirSync(path.dirname(linkPath), { recursive: true });
    fs.symlinkSync(path.relative(path.dirname(linkPath), target), linkPath);
}

/**
 * Write a file only when its content changed.
 *
 * Keeping the tree in place matters for `npm run server`: the watcher of Hexo
 * watches source_dir (the derived tree), and only files that actually changed
 * are regenerated.
 */
function writeIfChanged(file, text) {
    const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
    if (current === text) {
        return false;
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
    return true;
}

/** Drop generated markdown whose source file is gone, and the directories it left. */
function prune(dir, expected) {
    const walk = currentDir => {
        for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
            const full = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
                if (!fs.readdirSync(full).length) {
                    fs.rmdirSync(full);
                }
            } else if (entry.name.endsWith('.md') && !expected.has(path.relative(dir, full).split(path.sep).join('/'))) {
                fs.rmSync(full);
            }
        }
    };
    for (const name of CONTENT_DIRS) {
        const current = path.join(dir, name);
        if (fs.existsSync(current)) {
            walk(current);
        }
    }
}

/** Write the derived tree of one language; returns its bookkeeping. */
function writeTree(config, warn) {
    const dir = path.join(BUILD_DIR, config.lang);
    fs.mkdirSync(dir, { recursive: true });

    const records = new Map();
    for (const relPath of collectFiles()) {
        const full = path.join(SOURCE_DIR, relPath);
        if (!relPath.endsWith('.md') || !CONTENT_DIRS.some(prefix => relPath.startsWith(prefix + '/'))) {
            link(full, path.join(dir, relPath));
            continue;
        }
        const resolved = resolveFile(relPath, config.lang, message => warn(`${relPath}: ${message}`));
        if (!resolved) {
            continue;
        }
        writeIfChanged(path.join(dir, relPath), resolved.text);
        records.set(relPath, resolved);
    }
    prune(dir, new Set(records.keys()));

    for (const entry of fs.readdirSync(SOURCE_DIR, { withFileTypes: true })) {
        if (CONTENT_DIRS.includes(entry.name)) {
            continue;
        }
        link(path.join(SOURCE_DIR, entry.name), path.join(dir, entry.name));
    }
    return { dir, records };
}

function main() {
    const warnings = [];
    const warn = message => warnings.push(message);
    const configs = Object.fromEntries(LANGS.map(lang => [lang, readConfig(lang)]));
    const trees = Object.fromEntries(LANGS.map(lang => [lang, writeTree(configs[lang], warn)]));

    // Every markdown file, and where it lives in each language: the route path,
    // or null when the file has no version in that language.
    const routes = { zh: {}, en: {} };
    const skipped = [];
    for (const [relPath, zh] of trees.zh.records) {
        const en = trees.en.records.get(relPath);
        routes.zh[zh.route] = en ? en.route : null;
        if (!en) {
            skipped.push(relPath);
        }
    }
    for (const [relPath, en] of trees.en.records) {
        const zh = trees.zh.records.get(relPath);
        routes.en[en.route] = zh ? zh.route : null;
    }

    // Name pairs of categories and tags, aligned position by position.
    const pair = { categories: new Map(), tags: new Map() };
    const addPairs = (zhList, enList, kind) => {
        const a = Array.isArray(zhList) ? zhList : zhList === undefined ? [] : [zhList];
        const b = Array.isArray(enList) ? enList : enList === undefined ? [] : [enList];
        a.forEach((zhName, index) => {
            const enName = b[index];
            if (Array.isArray(zhName) || Array.isArray(enName)) {
                addPairs(zhName || [], enName || [], kind);
                return;
            }
            if (!zhName || !enName) {
                return;
            }
            const existing = pair[kind].get(zhName);
            if (existing && existing !== enName) {
                warn(`${kind}: "${zhName}" is translated as both "${existing}" and "${enName}"`);
                return;
            }
            pair[kind].set(zhName, enName);
        });
    };
    for (const [relPath, record] of trees.zh.records) {
        const en = trees.en.records.get(relPath);
        if (!en) {
            continue;
        }
        addPairs(record.data.categories, en.data.categories, 'categories');
        addPairs(record.data.tags, en.data.tags, 'tags');
    }

    // Slugs of the path segments of a taxonomy page: a pair is usable only when
    // both builds list the name, otherwise the other site has no such page.
    const slugs = { zh: { categories: {}, tags: {} }, en: { categories: {}, tags: {} } };
    for (const kind of ['categories', 'tags']) {
        const names = {};
        for (const lang of LANGS) {
            names[lang] = new Set();
            for (const record of trees[lang].records.values()) {
                for (const name of flatten(record.data[kind])) {
                    names[lang].add(name);
                }
            }
        }
        for (const zhName of names.zh) {
            const enName = pair[kind].get(zhName);
            if (!enName || !names.en.has(enName)) {
                continue;
            }
            const zhSlug = taxonomySlug(zhName, configs.zh, kind);
            const enSlug = taxonomySlug(enName, configs.en, kind);
            slugs.zh[kind][zhSlug] = enSlug;
            slugs.en[kind][enSlug] = zhSlug;
        }
    }

    for (const lang of LANGS) {
        const other = LANGS.find(item => item !== lang);
        const data = {
            lang,
            other,
            root: configs[lang].root,
            otherRoot: configs[other].root,
            paths: routes[lang],
            categories: slugs[lang].categories,
            tags: slugs[lang].tags
        };
        writeIfChanged(path.join(trees[lang].dir, '_data', 'i18n.json'), JSON.stringify(data, null, 4) + '\n');
    }

    const counts = LANGS.map(lang => `${lang}: ${trees[lang].records.size} files`).join(', ');
    console.log(`prepare-i18n: ${counts}`);
    if (skipped.length) {
        console.log(`prepare-i18n: no English version yet (${skipped.length}):`);
        for (const relPath of skipped) {
            console.log(`  - ${relPath}`);
        }
    }
    for (const message of warnings) {
        console.warn(`prepare-i18n: warning: ${message}`);
    }
}

/** Flatten the nested category arrays of a post into plain names. */
function flatten(list) {
    const result = [];
    const visit = value => {
        if (Array.isArray(value)) {
            value.forEach(visit);
        } else if (value) {
            result.push(value);
        }
    };
    visit(list);
    return result;
}

function invert(map) {
    return Object.fromEntries(Object.entries(map).map(([key, value]) => [value, key]));
}

main();
