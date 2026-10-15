/* The preview server of one language only renders that language: the
   middlewares of hexo-server answer below its root (/zh/ or /en/) and nothing
   else. A link to the other language would hit a 404, so this fallback serves
   the rest of public/ (the other site, the root page, the redirect stubs) from
   disk. It is registered after those middlewares on purpose: the language being
   previewed stays rendered live by Hexo, the other one comes from the last
   full build. */
const path = require('path');
const serveStatic = require('serve-static');

hexo.extend.filter.register('server_middleware', function (app) {
    const root = hexo.config.root;
    const serve = serveStatic(path.join(hexo.base_dir, 'public'), { index: ['index.html'] });
    app.use(function (req, res, next) {
        // Paths of the previewed language stay with Hexo (also the 404s, so a
        // stale file of a former build is never shown).
        if (req.url.startsWith(root)) {
            return next();
        }
        serve(req, res, next);
    });
});
