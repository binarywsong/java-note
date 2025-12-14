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
          { text: '快捷键', link: '/setup/terminal.md'},
          { text: 'CRUD', link: '/setup/crud.md'}
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
