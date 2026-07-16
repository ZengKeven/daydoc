<script setup lang="ts">
import { computed } from 'vue'
import { data as reports } from '../../reports.data'

const props = withDefaults(defineProps<{ mode?: 'home' | 'archive' }>(), {
  mode: 'home',
})

const visibleReports = computed(() => (props.mode === 'home' ? reports.slice(0, 5) : reports))
const totalProjects = computed(() => reports.reduce((sum, report) => sum + report.count, 0))
</script>

<template>
  <section class="report-dashboard" aria-label="趋势报告概览">
    <div class="report-stats">
      <div class="report-stat"><strong>{{ reports.length }}</strong><span>已生成报告</span></div>
      <div class="report-stat"><strong>{{ totalProjects }}</strong><span>累计收录项目</span></div>
      <div class="report-stat"><strong>{{ reports[0]?.date ?? '等待首期' }}</strong><span>最近更新时间</span></div>
    </div>

    <div v-if="visibleReports.length" class="report-list">
      <a v-for="report in visibleReports" :key="report.date" class="report-card" :href="report.url">
        <span class="report-date">{{ report.date }}</span>
        <span class="report-meta">新增 {{ report.count }} 个项目 · {{ report.highlights }}</span>
        <span class="report-arrow" aria-hidden="true">→</span>
      </a>
    </div>
    <p v-else>尚未生成报告。</p>

    <a v-if="mode === 'home'" class="archive-link" href="/reports/">查看完整报告归档 →</a>
  </section>
</template>
