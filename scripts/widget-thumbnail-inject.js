/* Inject the stylesheet that sizes the thumbnails of the "recents" widget. */
hexo.extend.injector.register('head_end', function () {
    return '<link rel="stylesheet" href="/_static/css/widget-thumbnail.css">';
});
