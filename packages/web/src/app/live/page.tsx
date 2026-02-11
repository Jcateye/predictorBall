import type { MatchCard as MatchCardDto } from '@predictor-ball/shared'
import { publicApiClient } from '@/lib/api-client'
import { MatchCard } from '@/components/MatchCard'

export default async function LivePage() {
  const matches = await publicApiClient<MatchCardDto[]>('/live')

  return (
    <div className="stack">
      <section className="panel">
        <h2 className="page-title">实时实况</h2>
        <p className="muted">排序规则：进行中 &gt; 2小时内即将开始 &gt; 其他</p>
      </section>
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} href={`/matches/${match.id}`} />
      ))}
    </div>
  )
}
