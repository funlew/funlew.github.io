/* Inject the stylesheet that shows the multi-language block matching the UI
   language (see source/_about/index.md and source/_static/js/lang-switch.js). */
hexo.extend.injector.register('head_end', function () {
    return '<link rel="stylesheet" href="/_static/css/i18n.css">';
});
