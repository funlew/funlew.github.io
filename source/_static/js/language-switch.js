/*!
 * Language switch button: opens the same page in the other language.
 *
 * Each page carries the path of its translation as
 * <link rel="alternate" hreflang="…" data-i18n-path> (written by scripts/i18n.js
 * at build time). Pages without a translation fall back to the home page of the
 * other language (<meta name="i18n-home">), and the reader's choice is
 * remembered so that a later visit to the site root opens that language.
 *
 * The click is handled in the capture phase and the propagation stopped, so the
 * PJAX handler of the theme does not swallow the cross language navigation.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'funlew-lang';

    function select(selector) {
        return document.querySelector(selector);
    }

    /** Path of the same page in the other language, or of its home page. */
    function targetUrl() {
        var alternate = select('link[rel="alternate"][data-i18n-path]');
        if (alternate && alternate.getAttribute('data-i18n-path')) {
            return alternate.getAttribute('data-i18n-path');
        }
        var home = select('meta[name="i18n-home"]');
        return home ? home.getAttribute('content') : null;
    }

    /** Language of the other version, so the choice can be remembered. */
    function otherLang() {
        return /^zh/i.test(document.documentElement.lang || '') ? 'en' : 'zh';
    }

    document.addEventListener('click', function (event) {
        var target = event.target;
        var link = target && target.closest ? target.closest('a.navbar-item') : null;
        if (!link || !link.querySelector || !link.querySelector('i.fa-language')) {
            return;
        }
        var url = targetUrl();
        if (!url) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        try {
            window.localStorage.setItem(STORAGE_KEY, otherLang());
        } catch (e) { /* ignore */ }
        window.location.href = url;
    }, true);
}());
