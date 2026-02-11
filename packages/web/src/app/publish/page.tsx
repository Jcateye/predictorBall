import type { MatchCard as MatchCardDto } from '@predictor-ball/shared'
import { publicApiClient } from '@/lib/api-client'
import { PublishForm } from '@/components/PublishForm'

export default async function PublishPage() {
  const matches = await publicApiClient<MatchCardDto[]>('/schedule?limit=50')

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
