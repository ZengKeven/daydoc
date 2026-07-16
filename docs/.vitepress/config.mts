import { defineConfig } from 'vitepress'

export default defineConfig({
  base: process.env.VITEPRESS_BASE ?? '/',
  lang: 'zh-CN',
  title: 'DayDoc',
  titleTemplate: ':title · DayDoc',
  description: '每日追踪 GitHub 上 Star 快速增长的 AI 与开发技术项目',
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    resolve: {
      dedupe: ['vue', 'vitepress'],
    },
    server: {
      fs: {
        allow: [
          'C:/DayDoc',
          'C:/Users/z2265/Documents/Codex/2026-07-16/chatgpt/outputs/github-trending',
        ],
      },
    },
  },
  head: [
    ['meta', { name: 'theme-color', content: '#07131f' }],
    ['meta', { name: 'color-scheme', content: 'dark light' }],
  ],
  themeConfig: {
    siteTitle: 'DayDoc',
    nav: [
      { text: '首页', link: '/' },
      { text: '报告归档', link: '/reports/' },
    ],
    sidebar: {
      '/reports/': [
        {
          text: '趋势报告',
          collapsed: false,
          items: [{ text: '全部报告', link: '/reports/' }],
        },
      ],
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一期', next: '下一期' },
    lastUpdated: { text: '页面更新时间', formatOptions: { dateStyle: 'medium', timeStyle: 'short' } },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索报告', buttonAriaLabel: '搜索报告' },
          modal: {
            noResultsText: '没有找到相关项目',
            resetButtonTitle: '清除搜索',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/trending' }],
    footer: {
      message: '数据来自 GitHub Trending 与各项目公开页面',
      copyright: '每日 08:00 自动更新 · Asia/Shanghai',
    },
  },
})
