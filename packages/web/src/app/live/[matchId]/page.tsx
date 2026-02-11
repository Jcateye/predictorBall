import type { LiveEventDto, LiveStatDto, MatchCard as MatchCardDto } from '@predictor-ball/shared'
import { publicApiClient } from '@/lib/api-client'
import { MatchCard } from '@/components/MatchCard'

interface LiveDetailResponse {
  match: MatchCardDto
  events: LiveEventDto[]
  stats?: LiveStatDto
  updatedAt: string
}

export default async function LiveDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params
  const detail = await publicApiClient<LiveDetailResponse>(`/live/${matchId}`)

  return (
    <div className="stack">
      <section className="panel">
        <h2 className="page-title">比赛实况详情</h2>
        <small className="muted">
          最后更新：{new Date(detail.updatedAt).toLocaleString('zh-CN')}
        </small>
      </section>

      <MatchCard match={detail.match} />

      <section className="panel">
        <h3>关键事件</h3>
        <ul className="plain-list">
          {detail.events.map((event) => (
            <li key={event.id}>
              {event.minute}' {event.player} - {event.detail}
            </li>
          ))}
        </ul>
      </section>

      {detail.stats ? (
        <section className="panel">
          <h3>基础统计</h3>
          <ul className="plain-list">
            <li>
              控球率：{detail.stats.possessionHome}% - {detail.stats.possessionAway}%
            </li>
            <li>
              射门：{detail.stats.shotsHome} - {detail.stats.shotsAway}
            </li>
            <li>
              角球：{detail.stats.cornersHome} - {detail.stats.cornersAway}
            </li>
            <li>
              犯规：{detail.stats.foulsHome} - {detail.stats.foulsAway}
            </li>
          </ul>
        </section>
      ) : null}
    </div>
  )
}
