import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../src/app.module'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

interface MockLoginResponse {
  token: string
  user: {
    id: string
    nickname: string
  }
}

interface FeedResponse {
  items: Array<{
    id: string
    priceType: 'free' | 'paid'
    summary: string[]
  }>
}

interface ReportDetailResponse {
  id: string
  priceType: 'free' | 'paid'
  hasEntitlement: boolean
  lockedContent?: {
    conclusion: string
  }
}

interface OrderResponse {
  orderNo: string
}

describe('PredictorBall MVP Flow (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api')
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  async function mockLogin(nickname: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/mock-login')
      .send({ nickname })
      .expect(201)

    const body = response.body as ApiResponse<MockLoginResponse>
    expect(body.success).toBe(true)
    expect(body.data?.token).toBeDefined()
    return body.data!.token
  }

  it('guest can browse feed and see free summary', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/feed').expect(200)
    const body = response.body as ApiResponse<FeedResponse>

    expect(body.success).toBe(true)
    expect(body.data?.items.length).toBeGreaterThan(0)
    expect(body.data?.items[0].summary.length).toBeGreaterThan(0)
  })

  it('locked report should unlock after mock payment', async () => {
    const token = await mockLogin('支付测试用户')
    const authHeader = { Authorization: `Bearer ${token}` }

    const feedResponse = await request(app.getHttpServer())
      .get('/api/v1/feed?priceType=paid')
      .expect(200)

    const feedBody = feedResponse.body as ApiResponse<FeedResponse>
    const targetReportId = feedBody.data?.items[0]?.id
    expect(targetReportId).toBeDefined()

    const lockedDetailResponse = await request(app.getHttpServer())
      .get(`/api/v1/reports/${targetReportId}`)
      .set(authHeader)
      .expect(200)

    const lockedDetailBody = lockedDetailResponse.body as ApiResponse<ReportDetailResponse>
    expect(lockedDetailBody.data?.hasEntitlement).toBe(false)
    expect(lockedDetailBody.data?.lockedContent).toBeUndefined()

    const orderResponse = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set(authHeader)
      .send({ reportId: targetReportId })
      .expect(201)

    const orderBody = orderResponse.body as ApiResponse<OrderResponse>
    expect(orderBody.success).toBe(true)
    expect(orderBody.data?.orderNo).toBeDefined()

    await request(app.getHttpServer())
      .post('/api/v1/payments/mock-confirm')
      .set(authHeader)
      .send({
        orderNo: orderBody.data?.orderNo,
        paymentEventId: `event-${Date.now()}`,
      })
      .expect(201)

    const unlockedDetailResponse = await request(app.getHttpServer())
      .get(`/api/v1/reports/${targetReportId}`)
      .set(authHeader)
      .expect(200)

    const unlockedDetailBody = unlockedDetailResponse.body as ApiResponse<ReportDetailResponse>
    expect(unlockedDetailBody.data?.hasEntitlement).toBe(true)
    expect(unlockedDetailBody.data?.lockedContent?.conclusion).toBeDefined()
  })

  it('publish with risky content should be blocked', async () => {
    const token = await mockLogin('风控测试用户')
    const authHeader = { Authorization: `Bearer ${token}` }

    const scheduleResponse = await request(app.getHttpServer())
      .get('/api/v1/schedule')
      .expect(200)

    const scheduleBody = scheduleResponse.body as ApiResponse<Array<{ id: string }>>
    const targetMatchId = scheduleBody.data?.[0]?.id
    expect(targetMatchId).toBeDefined()

    const publishResponse = await request(app.getHttpServer())
      .post('/api/v1/reports/publish')
      .set(authHeader)
      .send({
        matchId: targetMatchId,
        type: 'pre_match',
        summary: ['今晚包中，稳！'],
      })
      .expect(400)

    const publishBody = publishResponse.body as {
      message?: string | string[]
      error?: string
    }
    const message = Array.isArray(publishBody.message)
      ? publishBody.message.join(',')
      : (publishBody.message ?? '')

    expect(JSON.stringify({ message, error: publishBody.error })).toContain('风控词')
  })

  it('insights endpoint should return refresh-point payload', async () => {
    const response = await request(app.getHttpServer()).get('/api/v1/insights').expect(200)
    const body = response.body as ApiResponse<
      Array<{ refreshPoint: string; generatedAt: string }>
    >

    expect(body.success).toBe(true)
    expect(body.data?.length).toBeGreaterThan(0)
    expect(body.data?.[0].refreshPoint).toBeDefined()
    expect(body.data?.[0].generatedAt).toBeDefined()
  })

  it('report updates and recommendations should be queryable', async () => {
    const feedResponse = await request(app.getHttpServer())
      .get('/api/v1/feed?priceType=paid')
      .expect(200)
    const feedBody = feedResponse.body as ApiResponse<FeedResponse>
    const reportId = feedBody.data?.items[0]?.id
    expect(reportId).toBeDefined()

    const updatesResponse = await request(app.getHttpServer())
      .get(`/api/v1/reports/${reportId}/updates`)
      .expect(200)
    const updatesBody = updatesResponse.body as ApiResponse<Array<{ id: string }>>
    expect(updatesBody.success).toBe(true)
    expect(updatesBody.data).toBeDefined()

    const recommendationsResponse = await request(app.getHttpServer())
      .get(`/api/v1/reports/${reportId}/recommendations`)
      .expect(200)
    const recommendationsBody = recommendationsResponse.body as ApiResponse<{
      sameMatch: unknown[]
      moreFromAuthor: unknown[]
    }>
    expect(recommendationsBody.success).toBe(true)
    expect(recommendationsBody.data).toBeDefined()
  })

  it('feed should support filtering by matchId', async () => {
    const feedResponse = await request(app.getHttpServer()).get('/api/v1/feed').expect(200)
    const feedBody = feedResponse.body as ApiResponse<
      FeedResponse & { items: Array<{ match: { id: string } }> }
    >
    const matchId = feedBody.data?.items[0]?.match.id
    expect(matchId).toBeDefined()

    const filteredResponse = await request(app.getHttpServer())
      .get(`/api/v1/feed?matchId=${matchId}`)
      .expect(200)
    const filteredBody = filteredResponse.body as ApiResponse<
      FeedResponse & { items: Array<{ match: { id: string } }> }
    >

    expect(filteredBody.success).toBe(true)
    expect(filteredBody.data?.items.length).toBeGreaterThan(0)
    filteredBody.data?.items.forEach((item) => {
      expect(item.match.id).toBe(matchId)
    })
  })

  it('user can follow author and team then query follows list', async () => {
    const token = await mockLogin('关注测试用户')
    const authHeader = { Authorization: `Bearer ${token}` }

    const authorResponse = await request(app.getHttpServer()).get('/api/v1/feed').expect(200)
    const authorBody = authorResponse.body as ApiResponse<
      FeedResponse & { items: Array<{ author: { id: string } }> }
    >
    const authorId = authorBody.data?.items[0]?.author.id
    expect(authorId).toBeDefined()

    await request(app.getHttpServer())
      .post(`/api/v1/follows/authors/${authorId}`)
      .set(authHeader)
      .expect(201)

    const scheduleResponse = await request(app.getHttpServer())
      .get('/api/v1/schedule')
      .expect(200)
    const scheduleBody = scheduleResponse.body as ApiResponse<
      Array<{ id: string; status: string; homeTeam: { id: string } }>
    >
    const scheduledMatch = scheduleBody.data?.find((item) => item.status === 'scheduled')
    const teamId = scheduledMatch?.homeTeam.id
    expect(teamId).toBeDefined()

    await request(app.getHttpServer())
      .post(`/api/v1/follows/teams/${teamId}`)
      .set(authHeader)
      .expect(201)

    const matchId = scheduledMatch?.id
    expect(matchId).toBeDefined()

    await request(app.getHttpServer())
      .post(`/api/v1/follows/matches/${matchId}`)
      .set(authHeader)
      .expect(201)

    const followsResponse = await request(app.getHttpServer())
      .get('/api/v1/me/follows')
      .set(authHeader)
      .expect(200)
    const followsBody = followsResponse.body as ApiResponse<
      Array<{ targetId: string; targetType: string; targetName?: string }>
    >

    expect(followsBody.success).toBe(true)
    expect(followsBody.data?.some((item) => item.targetType === 'author')).toBe(true)
    expect(followsBody.data?.some((item) => item.targetType === 'team')).toBe(true)
    expect(followsBody.data?.some((item) => item.targetType === 'match')).toBe(true)
    expect(followsBody.data?.every((item) => item.targetName)).toBe(true)

    const remindersResponse = await request(app.getHttpServer())
      .get('/api/v1/me/reminders')
      .set(authHeader)
      .expect(200)
    const remindersBody = remindersResponse.body as ApiResponse<Array<{ matchId: string }>>
    expect(remindersBody.success).toBe(true)
    expect(remindersBody.data?.some((item) => item.matchId === matchId)).toBe(true)
  })

  it('insights refresh endpoint should generate payload', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/insights/refresh')
      .expect(201)
    const body = response.body as ApiResponse<Array<{ refreshPoint: string }>>
    expect(body.success).toBe(true)
    expect(body.data?.length).toBeGreaterThan(0)
    expect(body.data?.[0].refreshPoint).toBeDefined()
  })

  it('report owner can create update and non-owner cannot', async () => {
    const ownerToken = await mockLogin('报告更新作者')
    const ownerHeader = { Authorization: `Bearer ${ownerToken}` }

    const scheduleResponse = await request(app.getHttpServer())
      .get('/api/v1/schedule')
      .expect(200)
    const scheduleBody = scheduleResponse.body as ApiResponse<Array<{ id: string }>>
    const targetMatchId = scheduleBody.data?.[0]?.id
    expect(targetMatchId).toBeDefined()

    const publishResponse = await request(app.getHttpServer())
      .post('/api/v1/reports/publish')
      .set(ownerHeader)
      .send({
        matchId: targetMatchId,
        type: 'live_update',
        summary: ['测试报告，用于校验更新权限'],
      })
      .expect(201)

    const publishBody = publishResponse.body as ApiResponse<{ report: { id: string } }>
    const reportId = publishBody.data?.report.id
    expect(reportId).toBeDefined()

    await request(app.getHttpServer())
      .post(`/api/v1/reports/${reportId}/updates`)
      .set(ownerHeader)
      .send({
        content: '18:45 更新：首发名单已确认',
        level: 'major',
      })
      .expect(201)

    const updatesResponse = await request(app.getHttpServer())
      .get(`/api/v1/reports/${reportId}/updates`)
      .expect(200)
    const updatesBody = updatesResponse.body as ApiResponse<Array<{ content: string }>>
    expect(updatesBody.data?.some((item) => item.content.includes('首发名单'))).toBe(true)

    const otherToken = await mockLogin('路人用户')
    const otherHeader = { Authorization: `Bearer ${otherToken}` }

    await request(app.getHttpServer())
      .post(`/api/v1/reports/${reportId}/updates`)
      .set(otherHeader)
      .send({
        content: '我来改一下',
        level: 'minor',
      })
      .expect(403)
  })
})
