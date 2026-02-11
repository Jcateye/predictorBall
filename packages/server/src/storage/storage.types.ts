import type { ConfidenceLevel, OrderStatus, PriceType, ReportType } from '@predictor-ball/shared'
import type { AuthorProfileDto, AuthUser, FollowDto, LiveEventDto, LiveStatDto, MatchCard } from '@predictor-ball/shared'

export interface PersistedReport {
  id: string
  matchId: string
  authorId: string
  authorType: 'platform' | 'expert' | 'ai' | 'user'
  title: string
  type: ReportType
  priceType: PriceType
  price: number
  summary: string[]
  lockedOutline: string[]
  lockedContent?: {
    conclusion: string
    confidence: ConfidenceLevel
    keyVariables: string[]
    riskReversal: string[]
  }
  visibility: 'public' | 'paid'
  unlockCount: number
  updatedAt: string
  publishedAt: string
  score: number
  isAiGenerated: boolean
}

export interface PersistedOrder {
  id: string
  orderNo: string
  userId: string
  reportId: string
  amount: number
  status: OrderStatus
  createdAt: string
  paymentEventIds: string[]
}

export interface PersistedEntitlement {
  id: string
  userId: string
  reportId: string
  grantedAt: string
}

export type PersistedUser = AuthUser

export type PersistedAuthor = AuthorProfileDto

export interface PersistedMatch extends MatchCard {
  competitionId: string
}

export type PersistedLiveEvent = LiveEventDto

export type PersistedLiveStat = LiveStatDto

export interface PersistedFollow extends FollowDto {
  userId: string
  targetType: 'author' | 'team' | 'match'
}
