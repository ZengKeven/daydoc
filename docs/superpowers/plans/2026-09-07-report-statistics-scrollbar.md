# DayDoc Report Statistics and Scrollbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage and archive statistics derive from the canonical history index and give the report sidebar a subtle theme-aligned scrollbar.

**Architecture:** Extract a pure `buildReportDashboardData` function that combines Markdown report files with parsed `history.json`. The history index supplies cumulative and per-date counts; Markdown supplies report routes and display summaries. `ReportDashboard.vue` consumes the loader result, while `style.css` only changes the VitePress sidebar scrollbar presentation.

**Tech Stack:** VitePress 2, Vue 3, TypeScript DataLoader, Node built-in test runner, CSS scrollbar APIs, Playwright.

---

### Task 1: Add a failing statistics regression test

**Files:**
- Create: `tests/reports-data.test.mjs`
- Create: `docs/report-statistics.ts`
- Modify: `package.json`
- Test: `tests/reports-data.test.mjs`

- [ ] **Step 1: Add a Node test for canonical history counts**

Create a temporary fixture with two Markdown reports and 388 history entries, eight dated `2026-09-07`. Import `buildReportDashboardData` from `docs/report-statistics.ts` and assert `totalProjects === 388`, the 2026-09-07 count is 8, and a report without matching history records has count 0.

- [ ] **Step 2: Add the test command**

Add `"test": "node --test tests/*.test.mjs"` to `package.json`.

- [ ] **Step 3: Run the test and verify RED**

Run: `pnpm test`

Expected: FAIL because `docs/report-statistics.ts` does not exist yet.

### Task 2: Make history.json the statistics source of truth

**Files:**
- Modify: `docs/reports.data.ts`
- Create: `docs/report-statistics.ts`
- Modify: `docs/.vitepress/theme/ReportDashboard.vue`
- Test: `tests/reports-data.test.mjs`

- [ ] **Step 1: Define dashboard data types and pure builder**

Add `HistoryIndex` and `ReportDashboardData` interfaces. Implement a date counter over `history.repositories`, retain report date/URL/highlight parsing, and return `{ reports, totalProjects: history.repositories.length }`.

- [ ] **Step 2: Watch and load the history index**

Set the loader watch list to `['reports/*.md', 'reports/history.json']`, identify the JSON file in `watchedFiles`, parse it with `JSON.parse`, and pass the remaining Markdown paths to `buildReportDashboardData`. Missing or invalid history JSON must throw and fail the build.

- [ ] **Step 3: Consume the new loader result**

Change `ReportDashboard.vue` to import `{ data }`, derive `reports` and `totalProjects` from it, and remove the `reduce` calculation.

- [ ] **Step 4: Run the regression test and verify GREEN**

Run: `pnpm test`

Expected: PASS with the canonical history count and per-date count assertions.

### Task 3: Style the report sidebar scrollbar

**Files:**
- Modify: `docs/.vitepress/theme/style.css`

- [ ] **Step 1: Add cross-browser scrollbar styling**

Add a 6px Firefox/WebKit scrollbar for `.VPSidebar`, use a transparent track, a rounded low-contrast thumb, and a stronger brand-tinted thumb on sidebar hover. Do not change overflow behavior.

- [ ] **Step 2: Run the full automated checks**

Run: `pnpm test`

Expected: all tests PASS.

Run: `pnpm run docs:build`

Expected: VitePress exits 0 and renders every report.

### Task 4: Verify generated and rendered behavior

**Files:**
- Inspect: `docs/.vitepress/dist/index.html`
- Inspect: `docs/.vitepress/dist/reports/index.html`
- Inspect: `docs/.vitepress/dist/reports/2026-09-07.html`

- [ ] **Step 1: Verify static output**

Assert the homepage and archive contain cumulative count 388 and `2026-09-07` with 8 new projects; assert the report page title remains correct.

- [ ] **Step 2: Start local preview**

Run VitePress preview on `127.0.0.1:5173` in a hidden background process.

- [ ] **Step 3: Verify with Playwright**

Test the flow: `/` → latest report card → `/reports/2026-09-07`. Also open `/reports/`, inspect desktop and mobile viewports, record console warnings/errors, and capture screenshots of the corrected statistics and sidebar.

- [ ] **Step 4: Stop the preview server**

Terminate only the process listening on port 5173 that was started by this task.

- [ ] **Step 5: Review the final diff**

Run `git diff --check`, `git status --short`, and confirm only the design, plan, test, data loader, dashboard component, CSS, and package script changed.
