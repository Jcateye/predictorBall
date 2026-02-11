export type AuthorType = 'platform' | 'expert' | 'ai' | 'user'

export interface TeamBrief {
  name: string
  score?: number
}

export interface MatchMeta {
  id: string
  league: string
  stage: string
  kickOffLabel: string
  status: string
  statusTone: 'live' | 'upcoming' | 'default'
  home: TeamBrief
  away: TeamBrief
  statsLine?: string
  hot?: boolean
  pro?: boolean
}

export interface LiveEventItem {
  id: string
  minute: string
  type: string
  team: 'home' | 'away' | 'neutral'
  player: string
  detail: string
}

export interface LiveStatBarItem {
  label: string
  home: number
  away: number
  suffix?: string
}

export interface SignalItem {
  id: string
  signal: string
  impact: string
  confidenceLabel: '高' | '中' | '低'
  confidenceDots: 1 | 2 | 3
  evidence: string
  watch: string
}

export interface PredictCard {
  id: string
  type: AuthorType
  authorName: string
  badgeText: string
  hitRateText: string
  matchText: string
  summaries: string[]
  lockedItems: string[]
  ctaText: string
  ctaSubText: string
  isFree: boolean
  priceText?: string
}

export interface AuthorProfile {
  id: string
  name: string
  badgeText: string
  specialties: string[]
  weekHit: string
  monthHit: string
  totalReports: string
  streak: string
}
