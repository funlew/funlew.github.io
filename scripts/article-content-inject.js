/* Inject the stylesheet that improves markdown article body readability. */
hexo.extend.injector.register('head_end', function () {
    return '<link rel="stylesheet" href="/_static/css/article-content.css">';
});
