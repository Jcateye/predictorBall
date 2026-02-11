import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  DEFAULT_PAGINATION,
  type AuthorProfileDto,
  type AuthUser,
  type CreateReportUpdateDto,
  type CreateOrderDto,
  type EntitlementDto,
  type FeedItem,
  type FeedQuery,
  type FollowDto,
  type InsightReportDto,
  type LiveEventDto,
  type LiveStatDto,
  type MatchCard,
  type MatchStatus,
  type OrderDto,
  type PaymentConfirmDto,
  type PublishReportDto,
  type ReminderDto,
  type ReportDetailDto,
  type ReportRecommendationsDto,
  type ReportUpdateDto,
  type RiskCheckResultDto,
  type TeamBrief,
} from '@predictor-ball/shared'
import { MongoContentRepository } from '../storage/mongo-content.repository'
import type {
  PersistedAuthor,
  PersistedEntitlement,
  PersistedFollow,
  PersistedLiveEvent,
  PersistedLiveStat,
  PersistedMatch,
  PersistedOrder,
  PersistedReport,
  PersistedUser,
} from '../storage/storage.types'

interface RiskFlagRecord {
  id: string
  userId: string
  terms: string[]
  content: string[]
  createdAt: string
}

interface ReportUpdateRecord extends ReportUpdateDto {}

interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

@Injectable()
export class DataStoreService implements OnModuleInit {
  private readonly users: PersistedUser[] = []
  private readonly teams: TeamBrief[] = []
  private readonly matches: PersistedMatch[] = []
  private readonly liveEvents: PersistedLiveEvent[] = []
  private readonly liveStats: PersistedLiveStat[] = []
  private readonly reports: PersistedReport[] = []
  private readonly authors: PersistedAuthor[] = []
  private readonly orders: PersistedOrder[] = []
  private readonly entitlements: PersistedEntitlement[] = []
  private readonly follows: PersistedFollow[] = []
  private readonly riskFlags: RiskFlagRecord[] = []
  private readonly reportUpdates: ReportUpdateRecord[] = []
  private readonly insights: InsightReportDto[] = []
  private readonly useMongo: boolean

  constructor(
    configService: ConfigService,
    private readonly mongoContentRepository: MongoContentRepository,
  ) {
    this.useMongo = configService.get<boolean>('useMongo') ?? false
    this.seedData()
  }

  async onModuleInit(): Promise<void> {
    if (!this.useMongo || !this.mongoContentRepository.isReady()) {
      return
    }

    const userCount = await this.mongoContentRepository.countUsers()
    if (userCount === 0) {
      await this.mongoContentRepository.seedUsers(this.users)
    }

    const authorCount = await this.mongoContentRepository.countAuthors()
    if (authorCount === 0) {
      await this.mongoContentRepository.seedAuthors(this.authors)
    }

    const matchCount = await this.mongoContentRepository.countMatches()
    if (matchCount === 0) {
      await this.mongoContentRepository.seedMatches(this.matches)
    }

    const liveEventCount = await this.mongoContentRepository.countLiveEvents()
    if (liveEventCount === 0) {
      await this.mongoContentRepository.seedLiveEvents(this.liveEvents)
    }

    const liveStatCount = await this.mongoContentRepository.countLiveStats()
    if (liveStatCount === 0) {
      await this.mongoContentRepository.seedLiveStats(this.liveStats)
    }

    const reportCount = await this.mongoContentRepository.countReports()
    if (reportCount === 0) {
      await this.mongoContentRepository.seedReports(this.reports)
    }

    this.replaceArray(this.users, await this.mongoContentRepository.listUsers())
    this.replaceArray(this.authors, await this.mongoContentRepository.listAuthors())
    this.replaceArray(this.matches, await this.mongoContentRepository.listMatches())
    this.replaceArray(this.liveEvents, await this.mongoContentRepository.listLiveEvents())
    this.replaceArray(this.liveStats, await this.mongoContentRepository.listLiveStats())
    this.replaceArray(this.follows, await this.mongoContentRepository.listAllFollows())
  }

  getUserById(userId: string): AuthUser | undefined {
    return this.users.find((item) => item.id === userId)
  }

  async createOrGetMockUser(nickname?: string): Promise<AuthUser> {
    const normalized = nickname?.trim()
    if (!normalized) {
      return this.users[0]
    }

    const existing = this.users.find(
      (item) => item.nickname.toLowerCase() === normalized.toLowerCase(),
    )
    if (existing) {
      return existing
    }

    const user: AuthUser = {
      id: this.generateId('u'),
      nickname: normalized,
      role: 'user',
    }
    this.users.push(user)
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      await this.mongoContentRepository.upsertUser(user)
    }
    return user
  }

  listSchedule(params: {
    page: number
    limit: number
    status?: MatchStatus
    stage?: string
    groupCode?: string
    timeWindow?: FeedQuery['timeWindow']
  }): PaginatedResult<MatchCard> {
    const filtered = this.matches
      .filter((item) => !params.status || item.status === params.status)
      .filter((item) => !params.stage || item.stage === params.stage)
      .filter((item) => !params.groupCode || item.groupCode === params.groupCode)
      .filter((item) => this.matchTimeWindow(item.kickoffAt, params.timeWindow))
      .sort((a, b) => a.kickoffAt.localeCompare(b.kickoffAt))

    return this.paginate(filtered, params.page, params.limit)
  }

  getMatch(matchId: string): MatchCard {
    const match = this.matches.find((item) => item.id === matchId)
    if (!match) {
      throw new NotFoundException('Match not found')
    }
    return match
  }

  listLiveMatches(): MatchCard[] {
    const now = Date.now()
    const twoHours = 2 * 60 * 60 * 1000

    return [...this.matches].sort((left, right) => {
      const lPriority = this.livePriority(left, now, twoHours)
      const rPriority = this.livePriority(right, now, twoHours)
      if (lPriority !== rPriority) {
        return lPriority - rPriority
      }

      if (lPriority === 0) {
        return (right.minute ?? 0) - (left.minute ?? 0)
      }

      return left.kickoffAt.localeCompare(right.kickoffAt)
    })
  }

  getLiveDetail(matchId: string): {
    match: MatchCard
    events: LiveEventDto[]
    stats?: LiveStatDto
    updatedAt: string
  } {
    const match = this.getMatch(matchId)
    const events = this.liveEvents
      .filter((item) => item.matchId === matchId)
      .sort((a, b) => a.minute - b.minute)
    const stats = this.liveStats.find((item) => item.matchId === matchId)
    const updatedAt = stats?.updatedAt ?? events.at(-1)?.createdAt ?? match.kickoffAt

    return { match, events, stats, updatedAt }
  }

  async listFeed(
    query: Required<Pick<FeedQuery, 'page' | 'limit'>> & FeedQuery,
  ): Promise<PaginatedResult<FeedItem>> {
    const reports = (await this.getReportsSource())
      .filter((item) => !query.matchId || item.matchId === query.matchId)
      .filter((item) => !query.authorType || item.authorType === query.authorType)
      .filter((item) => !query.type || item.type === query.type)
      .filter((item) => !query.priceType || item.priceType === query.priceType)
      .filter((item) => this.matchTimeWindow(item.updatedAt, query.timeWindow))
      .filter((item) => this.matchQueryByStageGroup(item.matchId, query.stage, query.groupCode))
      .filter((item) => this.matchFeedSearch(item, query.search))

    const sorted = [...reports].sort((left, right) => this.feedSort(left, right, query.sort))
    const mapped = sorted.map((item) => this.toFeedItem(item))
    return this.paginate(mapped, query.page, query.limit)
  }

  async getReportDetail(reportId: string, userId?: string): Promise<ReportDetailDto> {
    const report = (await this.getReportsSource()).find((item) => item.id === reportId)
    if (!report) {
      throw new NotFoundException('Report not found')
    }

    const hasEntitlement =
      report.priceType === 'free' ||
      (await this.hasEntitlement(userId, report.id))

    const detail: ReportDetailDto = {
      id: report.id,
      author: this.toFeedAuthor(report.authorId),
      match: this.getMatch(report.matchId),
      title: report.title,
      type: report.type,
      priceType: report.priceType,
      price: report.price,
      updatedAt: report.updatedAt,
      freeReasons: report.summary,
      lockedOutline: report.lockedOutline,
      hasEntitlement,
      aiDisclaimer: report.isAiGenerated
        ? 'AI生成内容，仅供参考，不构成任何投资或博彩建议。'
        : undefined,
      lockedContent: hasEntitlement ? report.lockedContent : undefined,
    }

    return detail
  }

  async createOrder(userId: string, payload: CreateOrderDto): Promise<OrderDto> {
    const report = (await this.getReportsSource()).find((item) => item.id === payload.reportId)
    if (!report) {
      throw new NotFoundException('Report not found')
    }
    if (report.priceType !== 'paid') {
      throw new BadRequestException('Only paid report can create order')
    }

    const existingEntitlement = await this.findEntitlement(userId, payload.reportId)
    if (existingEntitlement) {
      throw new BadRequestException('Report already unlocked')
    }

    const existingPending = await this.findPendingOrder(userId, payload.reportId)
    if (existingPending) {
      return existingPending
    }

    const now = new Date().toISOString()
    const order: PersistedOrder = {
      id: this.generateId('order'),
      orderNo: `PB-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      userId,
      reportId: payload.reportId,
      amount: report.price,
      status: 'pending',
      createdAt: now,
      paymentEventIds: [],
    }

    await this.createOrderInSource(order)
    return order
  }

  async confirmMockPayment(userId: string, payload: PaymentConfirmDto): Promise<{
    order: OrderDto
    entitlement: EntitlementDto
  }> {
    const order = await this.findOrderByNoAndUser(payload.orderNo, userId)
    if (!order) {
      throw new NotFoundException('Order not found')
    }

    if (order.paymentEventIds.includes(payload.paymentEventId)) {
      const entitlement = await this.mustGetEntitlement(userId, order.reportId)
      return { order, entitlement }
    }

    order.paymentEventIds.push(payload.paymentEventId)

    if (order.status === 'paid') {
      const entitlement = await this.mustGetEntitlement(userId, order.reportId)
      return { order, entitlement }
    }

    order.status = 'paid'

    const entitlement = await this.createEntitlement(userId, order.reportId)
    const report = await this.findReportById(order.reportId)
    if (report) {
      report.unlockCount += 1
      report.updatedAt = new Date().toISOString()
      await this.upsertReportInSource(report)
    }

    await this.upsertOrderInSource(order)
    return { order, entitlement }
  }

  async listEntitlements(userId: string): Promise<EntitlementDto[]> {
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      return this.mongoContentRepository.listEntitlementsByUser(userId)
    }
    return this.entitlements.filter((item) => item.userId === userId)
  }

  async followAuthor(userId: string, authorId: string): Promise<{ followed: boolean }> {
    const author = this.authors.find((item) => item.id === authorId)
    if (!author) {
      throw new NotFoundException('Author not found')
    }
    const exists = this.follows.find(
      (item) => item.userId === userId && item.targetType === 'author' && item.targetId === authorId,
    )
    if (exists) {
      return { followed: true }
    }

    const follow: PersistedFollow = {
      id: this.generateId('follow'),
      userId,
      targetId: authorId,
      targetType: 'author',
      targetName: author.nickname,
      createdAt: new Date().toISOString(),
    }
    this.follows.push(follow)
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      await this.mongoContentRepository.upsertFollow(follow)
    }
    return { followed: true }
  }

  async followTeam(userId: string, teamId: string): Promise<{ followed: boolean }> {
    const team = this.teams.find((item) => item.id === teamId)
    if (!team) {
      throw new NotFoundException('Team not found')
    }
    const exists = this.follows.find(
      (item) => item.userId === userId && item.targetType === 'team' && item.targetId === teamId,
    )
    if (exists) {
      return { followed: true }
    }

    const follow: PersistedFollow = {
      id: this.generateId('follow'),
      userId,
      targetId: teamId,
      targetType: 'team',
      targetName: team.name,
      createdAt: new Date().toISOString(),
    }
    this.follows.push(follow)
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      await this.mongoContentRepository.upsertFollow(follow)
    }
    return { followed: true }
  }

  async followMatch(userId: string, matchId: string): Promise<{ followed: boolean }> {
    const match = this.matches.find((item) => item.id === matchId)
    if (!match) {
      throw new NotFoundException('Match not found')
    }
    const exists = this.follows.find(
      (item) => item.userId === userId && item.targetType === 'match' && item.targetId === matchId,
    )
    if (exists) {
      return { followed: true }
    }

    const follow: PersistedFollow = {
      id: this.generateId('follow'),
      userId,
      targetId: matchId,
      targetType: 'match',
      targetName: `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`,
      createdAt: new Date().toISOString(),
    }
    this.follows.push(follow)
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      await this.mongoContentRepository.upsertFollow(follow)
    }
    return { followed: true }
  }

  listFollows(userId: string, targetType?: 'author' | 'team' | 'match'): FollowDto[] {
    return this.follows
      .filter((item) => item.userId === userId)
      .filter((item) => !targetType || item.targetType === targetType)
      .map((item) => ({
        id: item.id,
        targetId: item.targetId,
        targetType: item.targetType,
        targetName: this.resolveFollowTargetName(item),
        createdAt: item.createdAt,
      }))
  }

  listUpcomingReminders(userId: string): ReminderDto[] {
    const now = Date.now()
    const next24h = now + 24 * 60 * 60 * 1000
    const followSet = this.follows.filter((item) => item.userId === userId)
    const followedMatchIds = new Set(
      followSet.filter((item) => item.targetType === 'match').map((item) => item.targetId),
    )
    const followedTeamIds = new Set(
      followSet.filter((item) => item.targetType === 'team').map((item) => item.targetId),
    )

    const reminders: ReminderDto[] = this.matches
      .filter((match) => match.status === 'scheduled')
      .filter((match) => {
        const kickoff = new Date(match.kickoffAt).getTime()
        return kickoff >= now && kickoff <= next24h
      })
      .flatMap((match) => {
        const result: ReminderDto[] = []
        if (followedMatchIds.has(match.id)) {
          result.push({
            id: `${match.id}-match-follow`,
            matchId: match.id,
            message: `你关注的比赛即将开赛：${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`,
            kickoffAt: match.kickoffAt,
            sourceType: 'match_follow',
          })
        }

        if (
          followedTeamIds.has(match.homeTeam.id) ||
          followedTeamIds.has(match.awayTeam.id)
        ) {
          result.push({
            id: `${match.id}-team-follow`,
            matchId: match.id,
            message: `你关注的球队比赛即将开赛：${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`,
            kickoffAt: match.kickoffAt,
            sourceType: 'team_follow',
          })
        }

        return result
      })

    return reminders.sort((a, b) => a.kickoffAt.localeCompare(b.kickoffAt))
  }

  async publishReport(userId: string, payload: PublishReportDto): Promise<{
    report: FeedItem
    risk: RiskCheckResultDto
  }> {
    const match = this.matches.find((item) => item.id === payload.matchId)
    if (!match) {
      throw new NotFoundException('Match not found')
    }

    const summary = payload.summary.map((item) => item.trim()).filter(Boolean)
    if (summary.length < 1 || summary.length > 3) {
      throw new BadRequestException('Summary must contain 1-3 items')
    }

    const risk = this.riskCheck(summary)
    if (risk.blocked) {
      this.riskFlags.push({
        id: this.generateId('risk'),
        userId,
        terms: risk.terms,
        content: summary,
        createdAt: new Date().toISOString(),
      })
      throw new BadRequestException(risk.message)
    }

    const authorId = await this.ensureAuthorForUser(userId)
    const now = new Date().toISOString()
    const report: PersistedReport = {
      id: this.generateId('report'),
      matchId: payload.matchId,
      authorId,
      authorType: 'user',
      title: `${match.homeTeam.shortName} vs ${match.awayTeam.shortName} 网友观点`,
      type: payload.type,
      priceType: 'free',
      price: 0,
      summary,
      lockedOutline: ['免费观点，不含付费区'],
      visibility: 'public',
      unlockCount: 0,
      updatedAt: now,
      publishedAt: now,
      score: 20,
      isAiGenerated: false,
    }

    await this.upsertReportInSource(report)
    return {
      report: this.toFeedItem(report),
      risk,
    }
  }

  listReportUpdates(reportId: string): ReportUpdateDto[] {
    return this.reportUpdates
      .filter((item) => item.reportId === reportId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  }

  async addReportUpdate(
    user: AuthUser,
    reportId: string,
    payload: CreateReportUpdateDto,
  ): Promise<ReportUpdateDto> {
    const report = await this.findReportById(reportId)
    if (!report) {
      throw new NotFoundException('Report not found')
    }

    const expectedAuthorId = `author-${user.id}`
    const isOwner = report.authorId === expectedAuthorId
    const isAdmin = user.role === 'admin'

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Only report owner can add update')
    }

    const content = payload.content.trim()
    if (!content) {
      throw new BadRequestException('Update content is required')
    }

    const update: ReportUpdateDto = {
      id: this.generateId('report_update'),
      reportId,
      timestamp: new Date().toISOString(),
      level: payload.level ?? 'minor',
      content,
    }

    this.reportUpdates.push(update)
    report.updatedAt = update.timestamp
    await this.upsertReportInSource(report)

    return update
  }

  async getReportRecommendations(reportId: string): Promise<ReportRecommendationsDto> {
    const targetReport = await this.findReportById(reportId)
    if (!targetReport) {
      throw new NotFoundException('Report not found')
    }

    const reports = await this.getReportsSource()
    const sameMatch = reports
      .filter((item) => item.id !== reportId && item.matchId === targetReport.matchId)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => this.toFeedItem(item))

    const moreFromAuthor = reports
      .filter((item) => item.id !== reportId && item.authorId === targetReport.authorId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 3)
      .map((item) => this.toFeedItem(item))

    return {
      sameMatch,
      moreFromAuthor,
    }
  }

  getAuthorProfile(authorId: string): AuthorProfileDto {
    const author = this.authors.find((item) => item.id === authorId)
    if (!author) {
      throw new NotFoundException('Author not found')
    }
    return author
  }

  async getAuthorReports(
    authorId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<FeedItem>> {
    const filtered = (await this.getReportsSource())
      .filter((item) => item.authorId === authorId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((item) => this.toFeedItem(item))

    return this.paginate(filtered, page, limit)
  }

  listInsights(matchId?: string): InsightReportDto[] {
    return this.insights.filter((item) => !matchId || item.matchId === matchId)
  }

  refreshInsights(): InsightReportDto[] {
    const now = new Date()
    const generated: InsightReportDto[] = this.matches
      .filter((match) => match.status !== 'finished')
      .map((match) => {
        const refreshPoint = this.resolveRefreshPoint(match.kickoffAt, now)
        const id = `insight_${match.id}_${refreshPoint}`
        const report = this.reports.find((item) => item.matchId === match.id)
        return {
          reportId: report?.id ?? '',
          matchId: match.id,
          generatedAt: now.toISOString(),
          refreshPoint,
          verifiedByHuman: false,
          signals: [
            {
              signal: `${match.homeTeam.name} 与 ${match.awayTeam.name} 阵容动态更新`,
              impact: '阵容变化将影响比赛节奏与对位优势',
              confidence: 'medium',
              observation: '开赛前确认首发名单和阵型',
            },
            {
              signal: `${match.stage} 阶段心理压力上升`,
              impact: '比赛后半段保守策略概率提高',
              confidence: 'low',
              observation: '关注60分钟后的换人方向',
            },
          ],
        }
      })

    generated.forEach((item) => {
      const existedIndex = this.insights.findIndex(
        (existing) =>
          existing.matchId === item.matchId && existing.refreshPoint === item.refreshPoint,
      )
      if (existedIndex >= 0) {
        this.insights[existedIndex] = item
      } else {
        this.insights.push(item)
      }
    })

    return generated
  }

  private async getReportsSource(): Promise<PersistedReport[]> {
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      return this.mongoContentRepository.listReports()
    }
    return this.reports
  }

  private async findReportById(reportId: string): Promise<PersistedReport | undefined> {
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      const result = await this.mongoContentRepository.findReportById(reportId)
      return result ?? undefined
    }
    return this.reports.find((item) => item.id === reportId)
  }

  private async upsertReportInSource(report: PersistedReport): Promise<void> {
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      await this.mongoContentRepository.upsertReport(report)
      return
    }

    const existingIndex = this.reports.findIndex((item) => item.id === report.id)
    if (existingIndex >= 0) {
      this.reports[existingIndex] = report
      return
    }
    this.reports.push(report)
  }

  private async findPendingOrder(
    userId: string,
    reportId: string,
  ): Promise<PersistedOrder | undefined> {
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      const result = await this.mongoContentRepository.findPendingOrder(userId, reportId)
      return result ?? undefined
    }
    return this.orders.find(
      (item) => item.userId === userId && item.reportId === reportId && item.status === 'pending',
    )
  }

  private async findOrderByNoAndUser(
    orderNo: string,
    userId: string,
  ): Promise<PersistedOrder | undefined> {
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      const result = await this.mongoContentRepository.findOrderByNoAndUser(orderNo, userId)
      return result ?? undefined
    }
    return this.orders.find((item) => item.orderNo === orderNo && item.userId === userId)
  }

  private async createOrderInSource(order: PersistedOrder): Promise<void> {
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      await this.mongoContentRepository.createOrder(order)
      return
    }
    this.orders.push(order)
  }

  private async upsertOrderInSource(order: PersistedOrder): Promise<void> {
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      await this.mongoContentRepository.upsertOrder(order)
      return
    }
    const index = this.orders.findIndex((item) => item.id === order.id)
    if (index >= 0) {
      this.orders[index] = order
      return
    }
    this.orders.push(order)
  }

  private async findEntitlement(
    userId: string,
    reportId: string,
  ): Promise<PersistedEntitlement | undefined> {
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      const result = await this.mongoContentRepository.findEntitlement(userId, reportId)
      return result ?? undefined
    }
    return this.entitlements.find(
      (item) => item.userId === userId && item.reportId === reportId,
    )
  }

  private async hasEntitlement(userId: string | undefined, reportId: string): Promise<boolean> {
    if (!userId) {
      return false
    }
    return Boolean(await this.findEntitlement(userId, reportId))
  }

  private riskCheck(summary: string[]): RiskCheckResultDto {
    const bannedTerms = ['下注', '包中', '稳赚', '代投', '返利', '拉群', '私聊', '带单']
    const content = summary.join(' ')
    const matched = bannedTerms.filter((term) => content.includes(term))

    return {
      blocked: matched.length > 0,
      terms: matched,
      message:
        matched.length > 0
          ? `内容触发风控词：${matched.join('、')}`
          : '内容通过风控检测',
    }
  }

  private async createEntitlement(
    userId: string,
    reportId: string,
  ): Promise<PersistedEntitlement> {
    const existing = await this.findEntitlement(userId, reportId)
    if (existing) {
      return existing
    }

    const entitlement: PersistedEntitlement = {
      id: this.generateId('ent'),
      userId,
      reportId,
      grantedAt: new Date().toISOString(),
    }
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      await this.mongoContentRepository.createEntitlement(entitlement)
      return (await this.findEntitlement(userId, reportId)) ?? entitlement
    }

    this.entitlements.push(entitlement)
    return entitlement
  }

  private async mustGetEntitlement(
    userId: string,
    reportId: string,
  ): Promise<PersistedEntitlement> {
    const entitlement = await this.findEntitlement(userId, reportId)
    if (!entitlement) {
      throw new NotFoundException('Entitlement not found')
    }
    return entitlement
  }

  private matchQueryByStageGroup(matchId: string, stage?: string, groupCode?: string): boolean {
    const match = this.matches.find((item) => item.id === matchId)
    if (!match) {
      return false
    }
    if (stage && match.stage !== stage) {
      return false
    }
    if (groupCode && match.groupCode !== groupCode) {
      return false
    }
    return true
  }

  private matchFeedSearch(report: PersistedReport, search?: string): boolean {
    if (!search?.trim()) {
      return true
    }

    const match = this.matches.find((item) => item.id === report.matchId)
    const author = this.authors.find((item) => item.id === report.authorId)
    const keyword = search.trim().toLowerCase()

    return [report.title, ...report.summary, match?.homeTeam.name, match?.awayTeam.name, author?.nickname]
      .filter(Boolean)
      .some((item) => item?.toLowerCase().includes(keyword))
  }

  private matchTimeWindow(timestamp: string, window?: FeedQuery['timeWindow']): boolean {
    if (!window) {
      return true
    }

    const now = new Date()
    const target = new Date(timestamp)
    const targetDate = this.toDateOnly(target)
    const currentDate = this.toDateOnly(now)

    if (window === 'today') {
      return targetDate === currentDate
    }

    if (window === 'tomorrow') {
      const tomorrow = new Date(now)
      tomorrow.setDate(now.getDate() + 1)
      return targetDate === this.toDateOnly(tomorrow)
    }

    const weekLater = new Date(now)
    weekLater.setDate(now.getDate() + 7)
    return target >= now && target <= weekLater
  }

  private feedSort(
    left: PersistedReport,
    right: PersistedReport,
    sort?: FeedQuery['sort'],
  ): number {
    if (sort === 'latest') {
      return right.updatedAt.localeCompare(left.updatedAt)
    }
    if (sort === 'hot') {
      return right.unlockCount - left.unlockCount
    }
    if (sort === 'hit_rate') {
      const leftAuthor = this.authors.find((item) => item.id === left.authorId)
      const rightAuthor = this.authors.find((item) => item.id === right.authorId)
      const leftRate = this.authorHitRate(leftAuthor?.hitRate30d)
      const rightRate = this.authorHitRate(rightAuthor?.hitRate30d)
      return rightRate - leftRate
    }

    return right.score - left.score
  }

  private toFeedItemFromMatch(match: MatchCard): FeedItem {
    return {
      id: `match-${match.id}`,
      match,
      author: {
        id: 'system',
        nickname: '赛程系统',
        type: 'platform',
        hitRate7d: { hit: 0, total: 0 },
      },
      title: `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`,
      type: 'pre_match',
      priceType: 'free',
      price: 0,
      summary: ['查看比赛详情与赛程状态'],
      lockedOutline: [],
      unlockCount: 0,
      updatedAt: match.kickoffAt,
      isAiGenerated: false,
    }
  }

  private toFeedItem(report: PersistedReport): FeedItem {
    return {
      id: report.id,
      match: this.getMatch(report.matchId),
      author: this.toFeedAuthor(report.authorId),
      title: report.title,
      type: report.type,
      priceType: report.priceType,
      price: report.price,
      summary: report.summary,
      lockedOutline: report.lockedOutline,
      unlockCount: report.unlockCount,
      updatedAt: report.updatedAt,
      isAiGenerated: report.isAiGenerated,
    }
  }

  private toFeedAuthor(authorId: string): FeedItem['author'] {
    const author = this.authors.find((item) => item.id === authorId)
    if (!author) {
      return {
        id: 'unknown',
        nickname: '未知作者',
        type: 'user',
        hitRate7d: { hit: 0, total: 0 },
      }
    }

    return {
      id: author.id,
      nickname: author.nickname,
      type: author.type,
      hitRate7d: author.hitRate7d,
    }
  }

  private authorHitRate(
    stat?: {
      hit: number
      total: number
    },
  ): number {
    if (!stat || stat.total < 10) {
      return 0
    }
    return stat.hit / stat.total
  }

  private paginate<T>(
    items: T[],
    page: number = DEFAULT_PAGINATION.PAGE,
    limit: number = DEFAULT_PAGINATION.LIMIT,
  ): PaginatedResult<T> {
    const safePage = page > 0 ? page : DEFAULT_PAGINATION.PAGE
    const safeLimit = Math.min(limit > 0 ? limit : DEFAULT_PAGINATION.LIMIT, DEFAULT_PAGINATION.MAX_LIMIT)
    const start = (safePage - 1) * safeLimit
    const sliced = items.slice(start, start + safeLimit)
    const total = items.length

    return {
      items: sliced,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    }
  }

  private livePriority(match: MatchCard, now: number, twoHours: number): number {
    if (match.status === 'live') {
      return 0
    }

    const kickoff = new Date(match.kickoffAt).getTime()
    if (match.status === 'scheduled' && kickoff - now <= twoHours && kickoff >= now) {
      return 1
    }

    return 2
  }

  private toDateOnly(date: Date): string {
    return date.toISOString().slice(0, 10)
  }

  private resolveRefreshPoint(
    kickoffAt: string,
    now: Date,
  ): InsightReportDto['refreshPoint'] {
    const kickoff = new Date(kickoffAt).getTime()
    const diffHours = (kickoff - now.getTime()) / (1000 * 60 * 60)

    if (diffHours <= 1) {
      return 'lineup_confirmed'
    }
    if (diffHours <= 6) {
      return 'T-1h'
    }
    if (diffHours <= 24) {
      return 'T-6h'
    }
    return 'T-24h'
  }

  private resolveFollowTargetName(record: PersistedFollow): string | undefined {
    if (record.targetType === 'author') {
      return this.authors.find((item) => item.id === record.targetId)?.nickname
    }

    if (record.targetType === 'team') {
      return this.teams.find((item) => item.id === record.targetId)?.name
    }

    const match = this.matches.find((item) => item.id === record.targetId)
    if (!match) {
      return undefined
    }
    return `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`
  }

  private async ensureAuthorForUser(userId: string): Promise<string> {
    const existing = this.authors.find((item) => item.id === `author-${userId}`)
    if (existing) {
      return existing.id
    }

    const user = this.getUserById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const profile: PersistedAuthor = {
      id: `author-${userId}`,
      nickname: user.nickname,
      type: 'user',
      tags: ['网友'],
      hitRate7d: { hit: 0, total: 0 },
      hitRate30d: { hit: 0, total: 0 },
      totalReports: 0,
    }
    this.authors.push(profile)
    if (this.useMongo && this.mongoContentRepository.isReady()) {
      await this.mongoContentRepository.upsertAuthor(profile)
    }
    return profile.id
  }

  private replaceArray<T>(target: T[], source: T[]): void {
    target.splice(0, target.length, ...source)
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
  }

  private seedData(): void {
    this.users.push(
      { id: 'u_demo', nickname: '世界杯观察员', role: 'user' },
      { id: 'u_admin', nickname: '平台运营', role: 'admin' },
    )

    this.teams.push(
      { id: 'team_fr', name: '法国', shortName: '法国' },
      { id: 'team_br', name: '巴西', shortName: '巴西' },
      { id: 'team_de', name: '德国', shortName: '德国' },
      { id: 'team_jp', name: '日本', shortName: '日本' },
      { id: 'team_ar', name: '阿根廷', shortName: '阿根廷' },
      { id: 'team_nl', name: '荷兰', shortName: '荷兰' },
    )

    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    this.matches.push(
      {
        id: 'match_fr_br',
        competitionId: 'wc2026',
        kickoffAt: new Date(now + 10 * oneHour).toISOString(),
        status: 'scheduled',
        stage: '淘汰赛',
        groupCode: undefined,
        homeTeam: this.teams[0],
        awayTeam: this.teams[1],
        homeScore: 0,
        awayScore: 0,
      },
      {
        id: 'match_de_jp',
        competitionId: 'wc2026',
        kickoffAt: new Date(now - 70 * oneHour).toISOString(),
        status: 'live',
        stage: '小组赛',
        groupCode: 'C',
        homeTeam: this.teams[2],
        awayTeam: this.teams[3],
        homeScore: 1,
        awayScore: 1,
        minute: 67,
      },
      {
        id: 'match_ar_nl',
        competitionId: 'wc2026',
        kickoffAt: new Date(now + 35 * oneHour).toISOString(),
        status: 'scheduled',
        stage: '淘汰赛',
        groupCode: undefined,
        homeTeam: this.teams[4],
        awayTeam: this.teams[5],
        homeScore: 0,
        awayScore: 0,
      },
    )

    this.authors.push(
      {
        id: 'author_platform',
        nickname: 'PredictorBall 平台',
        type: 'platform',
        tags: ['Network Insight'],
        hitRate7d: { hit: 6, total: 8 },
        hitRate30d: { hit: 23, total: 32 },
        totalReports: 120,
        streakBest: 7,
      },
      {
        id: 'author_zhangwei',
        nickname: '张伟·足球研究室',
        type: 'expert',
        tags: ['英超', '国家队', '战术流'],
        hitRate7d: { hit: 10, total: 14 },
        hitRate30d: { hit: 42, total: 68 },
        totalReports: 156,
        streakBest: 6,
      },
      {
        id: 'author_ai',
        nickname: 'PredictorBall AI',
        type: 'ai',
        tags: ['AI生成'],
        hitRate7d: { hit: 9, total: 14 },
        hitRate30d: { hit: 38, total: 60 },
        totalReports: 220,
        streakBest: 5,
      },
      {
        id: 'author_fan',
        nickname: '球迷老王',
        type: 'user',
        tags: ['网友'],
        hitRate7d: { hit: 4, total: 7 },
        hitRate30d: { hit: 16, total: 32 },
        totalReports: 18,
        streakBest: 3,
      },
    )

    const nowIso = new Date().toISOString()
    this.reports.push(
      {
        id: 'report_network_1',
        matchId: 'match_fr_br',
        authorId: 'author_platform',
        authorType: 'platform',
        title: '法国 vs 巴西 全网分析',
        type: 'pre_match',
        priceType: 'paid',
        price: 9.9,
        summary: [
          '法国中卫训练缺席，防空能力下降风险提升',
          '巴西赛前改练5后卫，低比分概率上升',
          '天气预警显示大雨，传控稳定性可能下降',
        ],
        lockedOutline: [
          '比赛形态判断 + 置信度',
          '关键变量雷达（阵容/体能/战术/定位球/天气/心理）',
          '风险点与反转条件',
        ],
        lockedContent: {
          conclusion: '节奏先快后慢，巴西下半场防守优势更明显，低比分倾向。',
          confidence: 'medium',
          keyVariables: ['阵容完整度', '边路对位', '定位球防守', '降雨强度'],
          riskReversal: ['若法国首发完整且先进球，节奏将被拉高'],
        },
        visibility: 'paid',
        unlockCount: 128,
        updatedAt: nowIso,
        publishedAt: nowIso,
        score: 98,
        isAiGenerated: false,
      },
      {
        id: 'report_expert_1',
        matchId: 'match_fr_br',
        authorId: 'author_zhangwei',
        authorType: 'expert',
        title: '法国 vs 巴西 赛前深度前瞻',
        type: 'pre_match',
        priceType: 'paid',
        price: 9.9,
        summary: [
          '法国边路推进效率受伤病影响，右路压迫下降',
          '巴西后场转换提速，反击第一点更稳定',
          '关键在法国中场能否抢下二点球',
        ],
        lockedOutline: ['比赛结论 + 置信度', '关键变量分析', '风险点 + 反转条件'],
        lockedContent: {
          conclusion: '巴西不败概率更高，建议关注90分钟内平局分支。',
          confidence: 'medium',
          keyVariables: ['中场抢断成功率', '边路传中质量', '体能分配'],
          riskReversal: ['若法国定位球先得分，本场结构将被重置'],
        },
        visibility: 'paid',
        unlockCount: 64,
        updatedAt: nowIso,
        publishedAt: nowIso,
        score: 92,
        isAiGenerated: false,
      },
      {
        id: 'report_ai_1',
        matchId: 'match_de_jp',
        authorId: 'author_ai',
        authorType: 'ai',
        title: '德国 vs 日本 临场样例（免费）',
        type: 'in_play',
        priceType: 'free',
        price: 0,
        summary: ['德国中路渗透效率下滑', '日本反击速度占优，后30分钟有进球窗口'],
        lockedOutline: ['免费样例，无锁定内容'],
        visibility: 'public',
        unlockCount: 233,
        updatedAt: nowIso,
        publishedAt: nowIso,
        score: 86,
        isAiGenerated: true,
      },
      {
        id: 'report_user_1',
        matchId: 'match_ar_nl',
        authorId: 'author_fan',
        authorType: 'user',
        title: '阿根廷 vs 荷兰 网友观点',
        type: 'pre_match',
        priceType: 'free',
        price: 0,
        summary: ['阿根廷中后场稳健，荷兰边路冲击会制造犯规机会'],
        lockedOutline: ['免费分享'],
        visibility: 'public',
        unlockCount: 35,
        updatedAt: nowIso,
        publishedAt: nowIso,
        score: 60,
        isAiGenerated: false,
      },
    )

    this.liveEvents.push(
      {
        id: 'event_1',
        matchId: 'match_de_jp',
        minute: 13,
        type: 'goal',
        team: 'home',
        player: '哈弗茨',
        detail: '禁区内推射破门',
        createdAt: new Date(now - 45 * oneHour).toISOString(),
      },
      {
        id: 'event_2',
        matchId: 'match_de_jp',
        minute: 38,
        type: 'goal',
        team: 'away',
        player: '久保建英',
        detail: '快速反击低射扳平',
        createdAt: new Date(now - 30 * oneHour).toISOString(),
      },
      {
        id: 'event_3',
        matchId: 'match_de_jp',
        minute: 61,
        type: 'yellow_card',
        team: 'home',
        player: '吕迪格',
        detail: '战术犯规',
        createdAt: new Date(now - 6 * oneHour).toISOString(),
      },
    )

    this.liveStats.push({
      matchId: 'match_de_jp',
      possessionHome: 58,
      possessionAway: 42,
      shotsHome: 11,
      shotsAway: 8,
      cornersHome: 5,
      cornersAway: 3,
      foulsHome: 9,
      foulsAway: 7,
      updatedAt: nowIso,
    })

    this.insights.push(
      {
        reportId: 'report_network_1',
        matchId: 'match_fr_br',
        generatedAt: nowIso,
        refreshPoint: 'T-6h',
        verifiedByHuman: true,
        signals: [
          {
            signal: '法国后防轮换不足',
            impact: '定位球防守风险上升',
            confidence: 'medium',
            observation: '赛前首发名单确认中卫组合',
          },
          {
            signal: '巴西训练改用5后卫',
            impact: '比赛节奏更慢，低比分概率提高',
            confidence: 'high',
            observation: '开场阵型是否维持5后卫',
          },
        ],
      },
    )

    this.reportUpdates.push(
      {
        id: 'update_network_1',
        reportId: 'report_network_1',
        timestamp: new Date(now - 60 * 60 * 1000).toISOString(),
        level: 'major',
        content: '18:45 更新：首发确认，法国改打 4-3-3，巴西维持 5 后卫。',
      },
      {
        id: 'update_network_2',
        reportId: 'report_network_1',
        timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
        level: 'minor',
        content: '16:30 更新：训练场显示巴西中场站位更偏保守。',
      },
      {
        id: 'update_expert_1',
        reportId: 'report_expert_1',
        timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        level: 'major',
        content: '17:20 更新：法国边后卫轮换，右路对位风险上调。',
      },
    )
  }
}
