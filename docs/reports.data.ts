import { readFileSync } from 'node:fs'
import type { DataLoader } from 'vitepress'
import {
  buildReportDashboardData,
  type HistoryIndex,
  type ReportDashboardData,
} from './report-statistics'

declare const data: ReportDashboardData
export { data }

export default {
  watch: ['reports/*.md', 'reports/history.json'],
  load(watchedFiles) {
    const historyFile = watchedFiles.find((file) => /[\\/]reports[\\/]history\.json$/.test(file))

    if (!historyFile) {
      throw new Error('DayDoc history index was not found at reports/history.json')
    }

    const history = JSON.parse(readFileSync(historyFile, 'utf8')) as HistoryIndex
    return buildReportDashboardData(watchedFiles, history)
  },
} satisfies DataLoader
