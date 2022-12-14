// 配置导航栏logo(themeConfig.logo)
// 配置导航栏logo(themeConfig.logo)
module.exports = {
  base: './',
  dest: './dist',
  // 搜索配置
  themeConfig: {
    search: true, // 设置是否使用导航栏上的搜索框
    searchMaxSuggestions: 10 // 搜索框显示的搜索结果数量
  },
  // 网站的一些基本配置
  // base:配置部署站点的基础路径，后续再介绍
  title: 'Technologystack', // 网站的标题
  description: 'CC的技术栈', // 网站的描述，它将会以 <meta> 标签渲染到当前页面的 HTML 中。
  head: [
    ['link', { rel: 'icon', href: '/logo.jpg' }] // 需要被注入到当前页面的 HTML <head> 中的标签
  ],
  // host port在本地运行就不配置了
  themeConfig: {
    logo: '/logo.jpg',
    nav: [
      // 直接跳转，'/'为不添加路由，跳转至首页，以/结尾的最终对应的都是/index.html,也就是README.md文件编译后的页面
      { text: 'Home', link: '/' },
      // 对应blog/fontend/README.md
      { text: 'ECMAScript', link: '/top/es/' },
      // 对应/guide/guide.md
      {
        text: 'Vue',
        items: [
          {
            items: [
              { text: '组合式API', link: '/top/vue/api/' },
              { text: 'module', link: '/top/vue/module/' },
              { text: 'packaging', link: '/top/vue/packaging/' },
              { text: 'component', link: '/top/vue/component/' }
            ]
          } // 可不写后缀 .md // 外部链接
        ]
      },
      { text: 'Uniapp', link: '/top/uniapp/' },
      { text: 'Tool', link: '/top/tool/' },
      { text: 'DebugFragment', link: '/top/debug/' }
      // 不指定深度，默认深度1-提取h2 最大深度-2，同一标题下最多提取到h3，想要改变深度可以指定sidebarDepth
    ],
    // 禁用导航栏
    // navbar: false,
    // 设置自动生成侧边栏
    sidebarDepth: 0,
    sidebar: 'auto'
  }
}
