import { readFileSync } from 'node:fs'
import type { DataLoader } from 'vitepress'

export interface ReportSummary {
  date: string
  url: string
  count: number
  highlights: string
}

declare const data: ReportSummary[]
export { data }

export default {
  watch: ['reports/*.md'],
  load(watchedFiles) {
    return watchedFiles
      .filter((file) => /\d{4}-\d{2}-\d{2}\.md$/.test(file))
      .map((file) => {
        const content = readFileSync(file, 'utf8')
        const date = file.match(/(\d{4}-\d{2}-\d{2})\.md$/)?.[1] ?? ''
        const count = Number(content.match(/今日新增[：:]\s*(\d+)\s*个项目/)?.[1] ?? 0)
        const highlights = [...content.matchAll(/^\d+\. \*\*(.+?)\*\*[：:]/gm)]
          .slice(0, 3)
          .map((match) => match[1])
          .join('、')

        return {
          date,
          url: `/reports/${date}`,
          count,
          highlights: highlights || '查看完整报告',
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  },
} satisfies DataLoader
