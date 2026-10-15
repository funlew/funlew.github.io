/* Inject the stylesheet that sizes the thumbnails of the "recents" widget.
   The asset URLs of the site start with the root of the build (/zh/ or /en/). */
hexo.extend.injector.register('head_end', function () {
    return `<link rel="stylesheet" href="${hexo.config.root}_static/css/widget-thumbnail.css">`;
});
