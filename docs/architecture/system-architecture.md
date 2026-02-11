# PredictorBall MVP 系统架构（Web First）

## 1. 架构概览

- 前端：Next.js 15（App Router）
- 后端：NestJS 10（模块化单体）
- 数据：MVP 使用 Mock Adapter + In-Memory Store；预留 Mongo（`USE_MONGO=true`）
- 契约：`@predictor-ball/shared` 统一 DTO / 枚举 / 响应结构

## 2. 后端模块

- `auth`：mock 登录 + Bearer token 校验
- `schedule`：赛程查询（阶段/分组/时间窗）
- `matches`：比赛详情
- `live`：实况列表与单场事件/统计
- `feed`：预测广场聚合、筛选、排序
- `reports`：报告详情、网友发布
- `orders`：订单创建
- `payments`：模拟支付确认（幂等）
- `me`：已购权益查询
- `follows`：关注作者/球队
- `authors`：作者主页及报告列表
- `insights`：平台全网分析刷新产物查询

## 3. 关键链路

1. 游客浏览：`/schedule`、`/live`、`/predict`
2. 登录：`POST /api/v1/auth/mock-login`
3. 解锁：`POST /api/v1/orders` -> `POST /api/v1/payments/mock-confirm`
4. 回看：`GET /api/v1/me/entitlements` + 报告详情自动解锁
5. 发布：`POST /api/v1/reports/publish`（风控词拦截）

## 4. 风控与合规

- 拦截词：下注、包中、稳赚、代投、返利、拉群、私聊、带单
- AI 报告显示免责声明：仅供参考，不构成博彩建议

## 5. 可扩展点

- 数据层：替换 In-Memory 为 Mongo Repository
- 缓存层：引入 Redis（实况高频场景）
- 支付层：接入真实支付与回调签名
- 运营层：新增后台 API/UI 审核管线
