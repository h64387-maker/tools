# 本地工具箱首页

React、Vite、TypeScript、Tailwind CSS v4 与 React Router 构建的工具箱首页原型。当前仅包含首页、四个工具占位路由与 404 页面，不包含任何真实工具处理逻辑。

## 已确认工具

- 日期时间工具：`/tools/date-time`
- MD5 工具：`/tools/md5`
- Base64 工具：`/tools/base64`
- JSON 工具：`/tools/json`

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
- 占位页只用于验证路由与视觉方向，不提供输入框、输出区或实际处理能力。
- 当前范围不包含后端、持久化、测试框架、工具实现或额外工具入口。
