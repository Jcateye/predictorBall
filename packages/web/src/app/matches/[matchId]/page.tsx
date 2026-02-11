import Link from 'next/link'
import type {
  LiveEventDto,
  LiveStatDto,
  MatchCard as MatchCardDto,
} from '@predictor-ball/shared'
import { notFound } from 'next/navigation'
import { liveDetailById } from '@/mocks/live'
import { MatchCard } from '@/components/MatchCard'
import { FollowTeamButton } from '@/components/FollowTeamButton'
import { FollowMatchButton } from '@/components/FollowMatchButton'

interface LiveDetailResponse {
  match: MatchCardDto
  events: LiveEventDto[]
  stats?: LiveStatDto
  updatedAt: string
}

function toMatchCardDto(detail: (typeof liveDetailById)[string], matchId: string): MatchCardDto {
  return {
    id: matchId,
    kickoffAt: new Date().toISOString(),
    status: 'live',
    stage: detail.match.stage,
    homeTeam: {
      id: `${matchId}-home`,
      name: detail.match.home.name,
      shortName: detail.match.home.name,
    },
    awayTeam: {
      id: `${matchId}-away`,
      name: detail.match.away.name,
      shortName: detail.match.away.name,
    },
    homeScore: detail.match.home.score ?? 0,
    awayScore: detail.match.away.score ?? 0,
  }
}

function toLiveDetailResponse(detail: (typeof liveDetailById)[string], matchId: string): LiveDetailResponse {
  const events: LiveEventDto[] = detail.events.map((event) => ({
    id: event.id,
    matchId,
    minute: Number(event.minute) || 0,
    type: 'goal',
    team: event.team === 'neutral' ? 'home' : event.team,
    player: event.player,
    detail: event.detail,
    createdAt: new Date().toISOString(),
  }))

  const stats: LiveStatDto = {
    matchId,
    possessionHome: detail.stats[0]?.home ?? 50,
    possessionAway: detail.stats[0]?.away ?? 50,
    shotsHome: detail.stats[1]?.home ?? 0,
    shotsAway: detail.stats[1]?.away ?? 0,
    cornersHome: detail.stats[2]?.home ?? 0,
    cornersAway: detail.stats[2]?.away ?? 0,
    foulsHome: detail.stats[3]?.home ?? 0,
    foulsAway: detail.stats[3]?.away ?? 0,
    updatedAt: new Date().toISOString(),
  }

  return {
    match: toMatchCardDto(detail, matchId),
    events,
    stats,
    updatedAt: new Date().toISOString(),
  }
}

export function generateStaticParams() {
  return Object.keys(liveDetailById).map((matchId) => ({ matchId }))
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params
  const detail = liveDetailById[matchId]

  if (!detail) {
    notFound()
  }

  const match = toMatchCardDto(detail, matchId)
  const liveDetail = toLiveDetailResponse(detail, matchId)

  return (
    <div className="stack">
      <section className="panel">
        <h2 className="page-title">比赛详情</h2>
        <div className="row">
          <Link href={`/live/${matchId}`} className="text-link">
            直播/实况
          </Link>
          <Link href={`/predict?matchId=${matchId}`} className="text-link">
            预测广场（同场）
          </Link>
        </div>
      </section>

      <MatchCard match={match} />

      <section className="panel">
        <h3>关注比赛</h3>
        <FollowMatchButton matchId={match.id} />
      </section>

      <section className="panel">
        <h3>关注球队</h3>
        <div className="stack">
          <FollowTeamButton teamId={match.homeTeam.id} label={match.homeTeam.name} />
          <FollowTeamButton teamId={match.awayTeam.id} label={match.awayTeam.name} />
        </div>
      </section>

      <section className="panel">
        <h3>关键事件时间线</h3>
        <ul className="plain-list">
          {liveDetail.events.length > 0 ? (
            liveDetail.events.map((event) => (
              <li key={event.id}>
                {event.minute}' {event.player} · {event.detail}
              </li>
            ))
          ) : (
            <li>暂无事件</li>
          )}
        </ul>
      </section>

      {liveDetail.stats ? (
        <section className="panel">
          <h3>基础统计</h3>
          <ul className="plain-list">
            <li>
              控球率：{liveDetail.stats.possessionHome}% - {liveDetail.stats.possessionAway}%
            </li>
            <li>
              射门：{liveDetail.stats.shotsHome} - {liveDetail.stats.shotsAway}
            </li>
            <li>
              角球：{liveDetail.stats.cornersHome} - {liveDetail.stats.cornersAway}
            </li>
            <li>
              犯规：{liveDetail.stats.foulsHome} - {liveDetail.stats.foulsAway}
            </li>
          </ul>
        </section>
      ) : null}
    </div>
  )
}
