import type { MatchCard as MatchCardDto } from '@predictor-ball/shared'
import { scheduleSections } from '@/mocks/schedule'
import { PublishForm } from '@/components/PublishForm'

function toMatchCardDtos(): MatchCardDto[] {
  return scheduleSections.flatMap((section) =>
    section.matches.map((match) => ({
      id: match.id,
      kickoffAt: new Date().toISOString(),
      status: 'scheduled',
      stage: match.stage,
      homeTeam: {
        id: `${match.id}-home`,
        name: match.home.name,
        shortName: match.home.name,
      },
      awayTeam: {
        id: `${match.id}-away`,
        name: match.away.name,
        shortName: match.away.name,
      },
      homeScore: match.home.score ?? 0,
      awayScore: match.away.score ?? 0,
    })),
  )
}

export default function PublishPage() {
  const matches = toMatchCardDtos()

  return (
    <div className="stack">
      <section className="panel">
        <h2 className="page-title">发布预测</h2>
        <p className="muted">MVP 阶段网友仅支持免费发布，且需通过风控词检测。</p>
      </section>
      <PublishForm matches={matches} />
    </div>
  )
}
