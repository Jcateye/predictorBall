import Link from 'next/link'
import type {
  LiveEventDto,
  LiveStatDto,
  MatchCard as MatchCardDto,
} from '@predictor-ball/shared'
import { publicApiClient } from '@/lib/api-client'
import { MatchCard } from '@/components/MatchCard'
import { FollowTeamButton } from '@/components/FollowTeamButton'
import { FollowMatchButton } from '@/components/FollowMatchButton'

interface LiveDetailResponse {
  match: MatchCardDto
  events: LiveEventDto[]
  stats?: LiveStatDto
  updatedAt: string
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params
  const match = await publicApiClient<MatchCardDto>(`/matches/${matchId}`)
  const liveDetail = await publicApiClient<LiveDetailResponse>(`/live/${matchId}`)

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
