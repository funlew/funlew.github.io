/* Inject the stylesheet that adds the avatar icon to the navbar logo. */
hexo.extend.injector.register('head_end', function () {
    return '<link rel="stylesheet" href="/_static/css/navbar-logo.css">';
});
