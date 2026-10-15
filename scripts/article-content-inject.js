/* Inject the stylesheet that improves markdown article body readability.
   The asset URLs of the site start with the root of the build (/zh/ or /en/,
   see _config.yml and _config.en.yml). */
hexo.extend.injector.register('head_end', function () {
    return `<link rel="stylesheet" href="${hexo.config.root}_static/css/article-content.css">`;
});
