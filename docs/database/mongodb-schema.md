# MongoDB 设计（MVP 目标模型）

> 当前代码阶段使用 In-Memory Mock Store，以下为一一映射的 Mongo 目标模型。

## 集合

- `users`
- `authors`
- `teams`
- `competitions`
- `stages`
- `matches`
- `live_events`
- `live_stats`
- `reports`
- `report_updates`
- `orders`
- `entitlements`
- `follows`
- `insight_jobs`
- `risk_flags`

## 关键字段与约束

- `reports.visibility`: `public | paid`
- `reports.authorType`: `platform | expert | ai | user`
- `reports.priceType`: `free | paid`
- `orders.status`: `pending | paid | failed | refunded`
- `matches.status`: `scheduled | live | finished | postponed`

## 核心索引

- `matches`: `{ kickoffAt: 1, status: 1, stage: 1, groupCode: 1 }`
- `reports`: `{ matchId: 1, publishedAt: -1, authorType: 1, priceType: 1 }`
- `reports` feed: `{ stage: 1, groupCode: 1, type: 1, priceType: 1, score: -1 }`
- `orders`: `unique(orderNo)`，并建 `{ userId: 1, reportId: 1 }`
- `entitlements`: `unique(userId, reportId)`
- `live_events`: `{ matchId: 1, minute: 1, createdAt: 1 }`

## 一致性与幂等

- 支付成功后事务写入：`orders -> entitlements`
- `paymentEventId` 幂等去重
- 实况写入使用 `upsert + sourceUpdatedAt` 防旧数据覆盖
