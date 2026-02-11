# PredictorBall 项目状态（2026-02-11）

## 当前阶段

- 状态：`MVP 功能联调中，核心路径可运行`
- 范围：Web First、Mock 数据适配、模拟支付闭环、游客浏览+登录后交易

## 已完成

- 共享契约层（`@predictor-ball/shared`）扩展：
  - 认证、比赛、实况、预测广场、报告详情、订单支付、权益、发布风控、全网分析等 DTO
  - 新增：`ReportUpdateDto`、`ReportRecommendationsDto`、`FollowDto`、`CreateReportUpdateDto`、`ReminderDto`
  - `ApiResponse` 元信息扩展 `requestId/serverTime`
- 后端 API（NestJS，`/api/v1`）落地：
  - `auth`、`schedule`、`matches`、`live`、`feed`、`reports`、`orders`、`payments`、`me`、`follows`、`authors`、`insights`
  - Mock 登录与 Bearer 鉴权
  - 模拟支付幂等确认 + entitlement 授权
  - 网友发布（1-3条摘要）+ 风控关键词拦截
  - 报告扩展接口：`/reports/:id/updates`（读写）、`/reports/:id/recommendations`
  - 广场扩展筛选：支持 `matchId` 过滤
  - 全网分析刷新接口：`POST /insights/refresh`
  - 我的关注列表：`GET /me/follows`
  - 关注比赛接口：`POST /follows/matches/:matchId`
  - 我的提醒：`GET /me/reminders`（基于关注球队/比赛的24小时提醒）
- 数据层升级（Mongo 可切换）：
  - 已迁移集合：`users`、`authors`、`matches`、`live_events`、`live_stats`、`follows`、`reports`、`orders`、`entitlements`
  - `MongoContentRepository` 支持上述集合种子写入、读取、upsert
  - `DataStoreService` 在 `USE_MONGO=true` 时会启动同步并加载缓存
  - 首次启用 Mongo 时自动写入种子数据（避免空库）
- 前端页面（Next.js App Router）落地：
  - `/live`、`/live/[matchId]`
  - `/schedule`
  - `/matches/[matchId]`
  - `/predict`、`/predict/reports/[reportId]`
  - `/authors/[authorId]`
  - `/publish`
  - `/me`
- 前端交互：
  - 预测广场筛选：作者类型、价格、排序、搜索、报告类型、阶段、小组、时间窗、同场过滤
  - 报告详情：更新记录、同场更多报告、更多来自TA、提交临场更新
  - 作者主页：报告/战绩/讨论 Tab 切换、关注按钮
  - 比赛详情：关注比赛、关注球队
  - 我的页面：展示已购权益 + 关注列表（含作者/球队/比赛）+ 24小时提醒
- 文档与任务包：
  - `docs/architecture/system-architecture.md`
  - `docs/contracts/api-v1.md`
  - `docs/database/mongodb-schema.md`
  - `docs/stories/mvp.user-stories.json`
- 自动化验收（e2e）
  - 游客浏览 feed
  - 登录后下单+模拟支付解锁
  - 风控违规发布拦截
  - insights 刷新点返回
  - 报告更新与推荐接口可用
  - feed 支持按 `matchId` 过滤
  - 登录后关注作者/球队/比赛并查询关注列表
  - 报告作者可提交更新，非作者拒绝（403）

## 运行说明

```bash
cp .env.example .env
pnpm dev
```

- Web: `http://localhost:3000`
- API Health: `http://localhost:3001/api/health`

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `MONGODB_URI` | `mongodb://localhost:27017/predictor-ball` | Mongo 连接地址 |
| `USE_MONGO` | `false` | 是否启用 Mongo 持久化（true 时启用已迁移集合） |
| `SERVER_PORT` | `3001` | 后端端口 |
| `CORS_ORIGIN` | `http://localhost:3000` | CORS 白名单 |
| `JWT_SECRET` | `predictor-ball-dev-secret` | mock token 签名密钥 |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | 前端 API 基础地址 |

## 下一步建议

- 接入真实赛事数据源（先 schedule，再 live ingest）
- 丰富提醒能力（T-24h / T-6h / T-1h / 首发后）并打通推送渠道
- 接入真实支付回调并加签验签
- 增加 e2e：命中率排序样本门槛边界、报告更新刷新时效
