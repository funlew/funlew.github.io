/* Inject the stylesheet that adds the avatar icon to the navbar logo.
   The asset URLs of the site start with the root of the build (/zh/ or /en/). */
hexo.extend.injector.register('head_end', function () {
    return `<link rel="stylesheet" href="${hexo.config.root}_static/css/navbar-logo.css">`;
});
