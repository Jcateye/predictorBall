# PredictorBall API v1 契约

基础前缀：`/api/v1`

## 公共响应

```ts
ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  meta?: {
    requestId?: string
    serverTime?: string
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
}
```

## 核心接口

- `GET /schedule`
  - query: `page, limit, status, stage, groupCode, timeWindow`
- `GET /matches/:matchId`
- `GET /live`
- `GET /live/:matchId`
- `GET /feed`
  - query: `page, limit, matchId, search, stage, groupCode, timeWindow, type, authorType, priceType, sort`
- `GET /reports/:reportId`
  - header 可选：`Authorization: Bearer <token>`
- `GET /reports/:reportId/updates`
- `POST /reports/:reportId/updates`（需登录，作者本人或管理员）
  - body: `{ content: string, level?: 'major' | 'minor' }`
- `GET /reports/:reportId/recommendations`
- `POST /auth/mock-login`
  - body: `{ nickname?: string }`
- `POST /reports/publish`（需登录）
  - body: `{ matchId: string, type: ReportType, summary: string[] }`
- `POST /orders`（需登录）
  - body: `{ reportId: string }`
- `POST /payments/mock-confirm`（需登录）
  - body: `{ orderNo: string, paymentEventId: string }`
- `GET /me/entitlements`（需登录）
- `GET /me/follows`（需登录）
- `GET /me/reminders`（需登录，返回未来24小时提醒）
- `POST /follows/authors/:authorId`（需登录）
- `POST /follows/teams/:teamId`（需登录）
- `POST /follows/matches/:matchId`（需登录）
- `GET /authors/:authorId`
- `GET /authors/:authorId/reports`
- `GET /insights?matchId=<id>`
- `POST /insights/refresh`

## 鉴权说明

- token 由 `mock-login` 返回
- 需登录接口使用 `Bearer` 头
- 无 token 或非法 token 返回 401
