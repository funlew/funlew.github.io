/* Inject the language switch script into every page. It follows the translation
   link of the current page to the same page in the other language
   (see scripts/i18n.js). The asset URLs of the site start with the root of the
   build (/zh/ or /en/). */
hexo.extend.injector.register('body_end', function () {
    return `<script src="${hexo.config.root}_static/js/language-switch.js" defer></script>`;
});
