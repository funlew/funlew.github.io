/* Keep static assets out of the insight search index.
 *
 * Hexo turns every non-Markdown file under source/ into a page whose layout is
 * false. Because "_static/**" is un-ignored by the include setting in
 * _config.yml, this site's own stylesheets and scripts land in that set, and
 * the insight generator of hexo-component-inferno maps all of locals.pages into
 * /content.json without filtering. They therefore reach the search box as
 * entries with an empty title, and their source matches code-related keywords.
 *
 * The generator is wrapped rather than the theme patched. Filtering locals is
 * not an option: _runGenerators() invalidates locals before every run, and
 * those asset pages are exactly what emits the files to public/.
 *
 * Register.register() replaces a generator of the same name instead of
 * appending to it, so wrapping here is enough. This runs from a before_generate
 * filter rather than at load time to stay independent of the order in which
 * the theme scripts and the site scripts are required.
 */
const CONTENT_JSON = '/content.json';

/* Generators already wrapped, so regenerating on every file change does not
   stack another wrapper on top of the previous one. */
const wrapped = new WeakSet();
let reported = false;

/* Pages Hexo created for plain files rather than for renderable content.
 * Hexo marks these with layout "false", which reaches us as a string rather
 * than a boolean, and the paths go through url_for because that is how the
 * generator stores them while page.path carries no leading slash. */
function assetPaths(locals, urlFor) {
    const paths = new Set();
    (locals.pages || []).forEach(page => {
        if (page.layout === 'false' || page.layout === false) {
            paths.add(urlFor(page.path));
        }
    });
    return paths;
}

function dropAssets(result, assets) {
    if (!result || result.path !== CONTENT_JSON || !result.data || assets.size === 0) {
        return result;
    }
    const index = JSON.parse(result.data);
    if (!Array.isArray(index.pages)) {
        return result;
    }
    const kept = index.pages.filter(entry => !assets.has(entry.link));
    const dropped = index.pages.length - kept.length;
    index.pages = kept;
    if (dropped > 0 && !reported) {
        reported = true;
        hexo.log.info('Search index: dropped %d static asset(s) from content.json', dropped);
    }
    return { path: result.path, data: JSON.stringify(index) };
}

hexo.extend.filter.register('before_generate', function () {
    const generators = hexo.extend.generator;
    const insight = generators.get('insight');
    if (typeof insight !== 'function' || wrapped.has(insight)) {
        return;
    }

    function filtered(locals) {
        /* Same helper, and so the same link format, as the wrapped generator. */
        const urlFor = hexo.extend.helper.get('url_for').bind(this);
        const assets = assetPaths(locals, urlFor);
        return Promise.resolve(insight.call(this, locals))
            .then(result => dropAssets(result, assets));
    }

    generators.register('insight', filtered);
    wrapped.add(generators.get('insight'));
});
