import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { buildReportDashboardData } from '../docs/report-statistics.ts'

test('uses canonical history for cumulative and per-day project counts', () => {
  const fixtureDir = mkdtempSync(join(tmpdir(), 'daydoc-reports-'))

  try {
    const latestReport = join(fixtureDir, '2026-09-07.md')
    const earlierReport = join(fixtureDir, '2026-09-06.md')

    writeFileSync(latestReport, '# 2026-09-07 report\n\n- **新增项目：999 个**\n')
    writeFileSync(earlierReport, '# 2026-09-06 report\n')

    const repositories = Array.from({ length: 388 }, (_, index) => ({
      canonical_url: `https://github.com/example/repository-${index}`,
      owner_repo: `example/repository-${index}`,
      first_seen_date: index < 8 ? '2026-09-07' : '2026-09-05',
      report_file: `outputs/github-trending/${index < 8 ? '2026-09-07' : '2026-09-05'}.md`,
    }))

    const result = buildReportDashboardData(
      [latestReport, earlierReport],
      { schema_version: 1, updated_at: '2026-09-07T08:12:00+08:00', repositories },
    )

    assert.equal(result.totalProjects, 388)
    assert.equal(result.reports.find((report) => report.date === '2026-09-07')?.count, 8)
    assert.equal(result.reports.find((report) => report.date === '2026-09-06')?.count, 0)
  } finally {
    rmSync(fixtureDir, { recursive: true, force: true })
  }
})
