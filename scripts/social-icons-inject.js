/* Inject the stylesheet that defines the inline brand icons
   (Weibo, Zhihu, Douyin, Jianshu, Discord, Twitter) used by the
   profile widget's social links. */
hexo.extend.injector.register('head_end', function () {
    return '<link rel="stylesheet" href="/css/social-icons.css">';
});
