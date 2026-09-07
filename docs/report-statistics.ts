import { readFileSync } from 'node:fs'

export interface HistoryRepository {
  first_seen_date: string
}

export interface HistoryIndex {
  schema_version: number
  updated_at: string
  repositories: HistoryRepository[]
}

export interface ReportSummary {
  date: string
  url: string
  count: number
  highlights: string
}

export interface ReportDashboardData {
  reports: ReportSummary[]
  totalProjects: number
}

export function buildReportDashboardData(
  reportFiles: string[],
  history: HistoryIndex,
): ReportDashboardData {
  const countsByDate = new Map<string, number>()

  for (const repository of history.repositories) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(repository.first_seen_date)) {
      countsByDate.set(
        repository.first_seen_date,
        (countsByDate.get(repository.first_seen_date) ?? 0) + 1,
      )
    }
  }

  const reports = reportFiles
    .filter((file) => /\d{4}-\d{2}-\d{2}\.md$/.test(file))
    .map((file) => {
      const content = readFileSync(file, 'utf8')
      const date = file.match(/(\d{4}-\d{2}-\d{2})\.md$/)?.[1] ?? ''
      const highlights = [...content.matchAll(/^\d+\. \*\*(.+?)\*\*[：:]/gm)]
        .slice(0, 3)
        .map((match) => match[1])
        .join('、')

      return {
        date,
        url: `/reports/${date}`,
        count: countsByDate.get(date) ?? 0,
        highlights: highlights || '查看完整报告',
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  return {
    reports,
    totalProjects: history.repositories.length,
  }
}
