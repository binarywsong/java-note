import { defineConfig } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "java-note",
  description: "java学习笔记",
  base: "/java-note/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' }
    ],

    sidebar: [
      {
        text: '重生',
        collapsed: true,
        items: [
          { text: '项目搭建', link: '/setup/project-create' },
          { text: '快捷键', link: '/setup/terminal'},
          { text: '工具', link: '/setup/javatool'},
          { text: 'CRUD', link: '/setup/crud'},
          { text: '业务代码', link: '/setup/demo1'}
        ]
      },
      {
        text: 'Java知识',
        collapsed: true,
        items: [
          {text: '注解', link:'/javaknowledge/annotate'}
        ]
      },
      {
        text: 'Java相关',
        collapsed: true,
        items: [
          {text: 'git commit规范', link: '/javaconnect/demo1'}
        ]
      },
      {
        text: "问题",
        collapsed: true,
        items: [
          {text: '后端问题', link: '/question/ideaquestion'}
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
