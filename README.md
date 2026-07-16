# DayDoc

使用 VitePress 展示每日 GitHub 开源项目 Star 趋势报告。

## 本地运行

```powershell
pnpm install
pnpm run docs:dev
```

默认访问地址：<http://127.0.0.1:5173>

## 生产构建

```powershell
pnpm run build
pnpm run docs:preview
```

新报告放入 `docs/reports/YYYY-MM-DD.md` 后，首页、全文搜索、侧边栏和报告归档会自动发现它。历史去重数据保存在根目录 `history.json`。
