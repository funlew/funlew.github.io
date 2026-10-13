/* Inject the UI language switch script into every page. */
hexo.extend.injector.register('body_end', function () {
    return '<script src="/js/lang-switch.js" defer></script>';
});
