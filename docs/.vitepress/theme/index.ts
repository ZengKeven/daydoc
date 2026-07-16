import DefaultTheme from 'vitepress/theme'
import ReportDashboard from './ReportDashboard.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReportDashboard', ReportDashboard)
  },
}
