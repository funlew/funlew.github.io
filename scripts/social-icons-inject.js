/* Inject the stylesheet that defines the inline brand icons
   (Weibo, Zhihu, Douyin, Jianshu, Discord, Twitter) used by the
   profile widget's social links.
   The asset URLs of the site start with the root of the build (/zh/ or /en/). */
hexo.extend.injector.register('head_end', function () {
    return `<link rel="stylesheet" href="${hexo.config.root}_static/css/social-icons.css">`;
});
