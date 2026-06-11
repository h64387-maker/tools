# 本地工具箱首页

React、Vite、TypeScript、Tailwind CSS v4 与 React Router 构建的本地工具箱首页。当前包含首页、四个工具入口、工具占位路由与 404 页面；日期时间和 JSON 已提供首页弹窗工具体验。

## 已确认工具

- 日期时间工具：`/tools/date-time`
- MD5 工具：`/tools/md5`
- Base64 工具：`/tools/base64`
- JSON 工具：`/tools/json`（首页卡片打开弹窗，支持格式化、压缩、校验与复制）

## 命令

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm run preview
```

## 开发说明

- 首页搜索为本地客户端过滤，会匹配工具名称、说明与关键词。
- JSON 工具从首页卡片打开弹窗；`/tools/json` 直达路由保留为导航占位提示。
- MD5 和 Base64 仍为占位工具，不提供实际处理能力。
- 当前范围不包含后端、持久化、测试框架或额外工具入口。
