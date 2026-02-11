export type UserRole = 'guest' | 'user' | 'admin'

export type AuthorType = 'platform' | 'expert' | 'ai' | 'user'

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed'

export type ReportVisibility = 'public' | 'paid'

export type ReportType = 'pre_match' | 'live_update' | 'in_play' | 'review'

export type PriceType = 'free' | 'paid'

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface AuthUser {
  id: string
  nickname: string
  role: UserRole
}

export interface JwtPayload {
  userId: string
  role: UserRole
}

export interface TeamBrief {
  id: string
  name: string
  shortName: string
}

export interface MatchCard {
  id: string
  kickoffAt: string
  status: MatchStatus
  stage: string
  groupCode?: string
  homeTeam: TeamBrief
  awayTeam: TeamBrief
  homeScore: number
  awayScore: number
  minute?: number
}

export interface LiveEventDto {
  id: string
  matchId: string
  minute: number
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var'
  team: 'home' | 'away'
  player: string
  detail: string
  createdAt: string
}

export interface LiveStatDto {
  matchId: string
  possessionHome: number
  possessionAway: number
  shotsHome: number
  shotsAway: number
  cornersHome: number
  cornersAway: number
  foulsHome: number
  foulsAway: number
  updatedAt: string
}

export interface FeedQuery {
  page?: number
  limit?: number
  matchId?: string
  stage?: string
  groupCode?: string
  timeWindow?: 'today' | 'tomorrow' | 'this_week'
  type?: ReportType
  authorType?: AuthorType
  priceType?: PriceType
  sort?: 'recommended' | 'latest' | 'hot' | 'hit_rate'
  search?: string
}

export interface FeedAuthor {
  id: string
  nickname: string
  type: AuthorType
  hitRate7d: {
    hit: number
    total: number
  }
}

export interface FeedItem {
  id: string
  match: MatchCard
  author: FeedAuthor
  title: string
  type: ReportType
  priceType: PriceType
  price: number
  summary: string[]
  lockedOutline: string[]
  unlockCount: number
  updatedAt: string
  isAiGenerated: boolean
}

export interface ReportDetailDto {
  id: string
  author: FeedAuthor
  match: MatchCard
  title: string
  type: ReportType
  priceType: PriceType
  price: number
  updatedAt: string
  freeReasons: string[]
  lockedOutline: string[]
  lockedContent?: {
    conclusion: string
    confidence: ConfidenceLevel
    keyVariables: string[]
    riskReversal: string[]
  }
  hasEntitlement: boolean
  aiDisclaimer?: string
}

export interface ReportUpdateDto {
  id: string
  reportId: string
  timestamp: string
  level: 'major' | 'minor'
  content: string
}

export interface ReportRecommendationsDto {
  sameMatch: FeedItem[]
  moreFromAuthor: FeedItem[]
}

export interface InsightSignalDto {
  signal: string
  impact: string
  confidence: ConfidenceLevel
  observation: string
}

export interface InsightReportDto {
  reportId: string
  matchId: string
  generatedAt: string
  refreshPoint: 'T-24h' | 'T-6h' | 'T-1h' | 'lineup_confirmed'
  verifiedByHuman: boolean
  signals: InsightSignalDto[]
}

export interface CreateOrderDto {
  reportId: string
}

export interface OrderDto {
  id: string
  orderNo: string
  userId: string
  reportId: string
  amount: number
  status: OrderStatus
  createdAt: string
}

export interface PaymentConfirmDto {
  orderNo: string
  paymentEventId: string
}

export interface EntitlementDto {
  id: string
  userId: string
  reportId: string
  grantedAt: string
}

export interface FollowDto {
  id: string
  targetId: string
  targetType: 'author' | 'team' | 'match'
  targetName?: string
  createdAt: string
}

export interface CreateReportUpdateDto {
  content: string
  level?: 'major' | 'minor'
}

export interface ReminderDto {
  id: string
  matchId: string
  message: string
  kickoffAt: string
  sourceType: 'team_follow' | 'match_follow'
}

export interface PublishReportDto {
  matchId: string
  type: ReportType
  summary: string[]
}

export interface RiskCheckResultDto {
  blocked: boolean
  terms: string[]
  message: string
}

export interface AuthorProfileDto {
  id: string
  nickname: string
  type: AuthorType
  tags: string[]
  hitRate7d: {
    hit: number
    total: number
  }
  hitRate30d: {
    hit: number
    total: number
  }
  totalReports: number
  streakBest?: number
}
