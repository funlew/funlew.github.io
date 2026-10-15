#!/usr/bin/env node
/**
 * Build, preview or clean the bilingual site.
 *
 *   node tools/build.mjs           build everything (what `npm run build` does)
 *   node tools/build.mjs serve zh  preview the Chinese site on :4000
 *   node tools/build.mjs serve en  preview the English site on :4001
 *   node tools/build.mjs clean     remove public/, .build/ and db.json
 *
 * A full build is:
 *
 *   1. tools/prepare-i18n.mjs resolves source/ into .build/zh and .build/en
 *   2. Hexo generates the Chinese site into public/zh (config/_config.zh.yml) and
 *      the English one into public/en (config/_config.zh.yml + _config.en.yml)
 *   3. public/index.html becomes the language selection page, and every page of
 *      the Chinese site also gets a redirect stub where it used to be published
 *      (the Chinese site lived at the site root until it moved to /zh/)
 *   4. the two builds are cross checked: every translated page must exist in the
 *      other build, so the language switch button never leads to a 404
 *
 * GitHub Pages serves public/ as it is; the deploy workflow runs this script.
 */
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const HEXO = path.join(ROOT, 'node_modules', '.bin', 'hexo');
const SOURCE_DIR = path.join(ROOT, 'source');
const PUBLIC_DIR = path.join(ROOT, 'public');
const BUILD_DIR = path.join(ROOT, '.build');
const SITE_URL = 'https://funlew.github.io';

/** The two builds: Hexo arguments, output directory, dev server port. */
const LANGS = {
    zh: { hexo: ['--config', 'config/_config.zh.yml'], dir: 'zh', port: 4000, label: '中文' },
    en: { hexo: ['--config', 'config/_config.zh.yml,config/_config.en.yml'], dir: 'en', port: 4001, label: 'English' }
};

function run(command, args) {
    const result = spawnSync(command, args, { cwd: ROOT, stdio: 'inherit' });
    if (result.status !== 0) {
        process.exit(result.status === null ? 1 : result.status);
    }
}

const prepare = () => run(process.execPath, [path.join(ROOT, 'tools', 'prepare-i18n.mjs')]);
const hexo = args => run(HEXO, args);

/** Whether a preview port can be used (all interfaces, like hexo-server does). */
function portFree(port) {
    return new Promise(resolve => {
        const probe = net.createServer();
        probe.once('error', () => resolve(false));
        probe.once('listening', () => probe.close(() => resolve(true)));
        probe.listen(port);
    });
}

/** The configured preview port, or the next free one when it is taken. */
async function previewPort(start) {
    for (let port = start; port < start + 10; port++) {
        if (await portFree(port)) {
            if (port !== start) {
                console.log(`build: port ${start} is taken, previewing on ${port} instead`);
            }
            return port;
        }
    }
    return start;
}

function generate(lang) {
    const { hexo: args } = LANGS[lang];
    hexo(['clean', ...args]);
    hexo(['generate', ...args]);
}

/** URL of a route path inside one of the two sites. */
function urlOf(lang, route) {
    return `${SITE_URL}/${lang}/${route.replace(/index\.html$/, '')}`;
}

/** The page shown at the site root: pick a language, then hand over. */
function writeRootPage() {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>funlew 的博客 · funlew's blog</title>
    <link rel="canonical" href="${SITE_URL}/zh/">
    <link rel="alternate" hreflang="zh-CN" href="${SITE_URL}/zh/">
    <link rel="alternate" hreflang="en" href="${SITE_URL}/en/">
    <link rel="alternate" hreflang="x-default" href="${SITE_URL}/">
    <style>
        :root { color-scheme: light dark; }
        body {
            display: flex;
            min-height: 100vh;
            margin: 0;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
        }
        main { padding: 1.5rem; text-align: center; }
        h1 { font-size: 1.25rem; font-weight: 600; }
        p { color: #666; }
        a { display: inline-block; margin: 0 .5rem; font-size: 1.1rem; }
    </style>
</head>
<body>
    <main>
        <h1>funlew 的博客 · funlew's blog</h1>
        <p>这个站点有中文和英文两个版本。<br>This site comes in Chinese and English.</p>
        <p><a href="/zh/" hreflang="zh-CN" lang="zh-CN">中文</a><a href="/en/" hreflang="en" lang="en">English</a></p>
    </main>
    <script>
        // The language of the last visit wins, otherwise the browser decides:
        // Chinese speaking readers get /zh/, everybody else the English site.
        (function () {
            var stored = null;
            try { stored = window.localStorage.getItem('funlew-lang'); } catch (e) { /* ignore */ }
            if (stored !== 'zh' && stored !== 'en') {
                var tags = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
                stored = tags.some(function (tag) { return /^zh/i.test(tag); }) ? 'zh' : 'en';
            }
            window.location.replace('/' + stored + '/');
        }());
    </script>
</body>
</html>
`;
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), html);
}

/**
 * Redirect the URLs the Chinese site used before it moved to /zh/, so that old
 * links (and anything a search engine already knows) keep working.
 */
function writeRedirects() {
    const root = path.join(PUBLIC_DIR, LANGS.zh.dir);
    const written = [];
    const walk = dir => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            } else if (entry.name === 'index.html') {
                const route = path.relative(root, full).split(path.sep).join('/');
                const target = `/${LANGS.zh.dir}/${route.replace(/index\.html$/, '')}`;
                if (route === 'index.html' || target.split('/')[1] === LANGS.en.dir) {
                    continue;
                }
                const file = path.join(PUBLIC_DIR, route);
                fs.mkdirSync(path.dirname(file), { recursive: true });
                fs.writeFileSync(file, `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <title>页面已迁移 · Page moved</title>
    <link rel="canonical" href="${SITE_URL}${target}">
    <meta http-equiv="refresh" content="0; url=${target}">
    <script>window.location.replace('${target}');</script>
</head>
<body>
    <p>这个页面已迁移到 <a href="${target}">${target}</a>。</p>
    <p>This page moved to <a href="${target}">${target}</a>.</p>
</body>
</html>
`);
                written.push(route);
            }
        }
    };
    walk(root);
    console.log(`build: ${written.length} redirect(s) for the former site root`);
}

/** Every translated page must exist in the other build. */
function check() {
    let checked = 0;
    const missing = [];
    for (const lang of Object.keys(LANGS)) {
        const file = path.join(BUILD_DIR, lang, '_data', 'i18n.json');
        const map = JSON.parse(fs.readFileSync(file, 'utf8'));
        for (const [route, other] of Object.entries(map.paths)) {
            if (other === null) {
                continue;
            }
            checked++;
            if (!fs.existsSync(path.join(PUBLIC_DIR, map.other, other))) {
                missing.push(`/${lang}/${route} → /${map.other}/${other}`);
            }
        }
    }
    console.log(`build: checked ${checked} translation link(s)`);
    for (const link of missing) {
        console.warn(`build: warning: alternate link leads nowhere: ${link}`);
    }
}

/**
 * Re-prepare the derived trees whenever content under source/ changes, so that
 * the watcher of Hexo (which watches the derived tree) regenerates the edited
 * page. The watcher is kept in a module level variable on purpose: an
 * unreferenced FSWatcher can be garbage collected and then stops reporting.
 */
let sourceWatcher = null;

function watch() {
    let timer = null;
    try {
        sourceWatcher = fs.watch(SOURCE_DIR, { recursive: true }, () => {
            clearTimeout(timer);
            timer = setTimeout(prepare, 200);
        });
        sourceWatcher.on('error', error => {
            console.warn(`build: warning: source/ watcher stopped (${error.message}), restart the preview`);
        });
    } catch (error) {
        console.warn(`build: warning: cannot watch source/, run "npm run prepare:i18n" after editing: ${error.message}`);
    }
}

async function main() {
    const [command = 'build', lang = 'zh'] = process.argv.slice(2);

    if (command === 'clean') {
        for (const target of [PUBLIC_DIR, BUILD_DIR, path.join(ROOT, 'db.json')]) {
            fs.rmSync(target, { recursive: true, force: true });
        }
        console.log('build: removed public/, .build/ and db.json');
        return;
    }

    if (command === 'serve') {
        prepare();
        watch();
        const port = await previewPort(LANGS[lang].port);
        // Spawned asynchronously (unlike the build steps): the watcher above only
        // fires while the event loop of this process keeps running.
        const server = spawn(HEXO, ['server', '-p', String(port), ...LANGS[lang].hexo], {
            cwd: ROOT,
            stdio: 'inherit'
        });
        server.on('exit', code => process.exit(code === null ? 0 : code));
        return;
    }

    prepare();
    // The whole output is derived: starting from an empty public/ keeps files of
    // a former layout (the Chinese site used to be published at the root) out.
    fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
    for (const lang of Object.keys(LANGS)) {
        generate(lang);
    }
    writeRootPage();
    writeRedirects();
    check();
    console.log('build: done, public/ is ready to be published');
}

main();
