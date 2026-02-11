import { PredictFeedClient } from '@/components/PredictFeedClient'

export default async function PredictPage({
  searchParams,
}: {
  searchParams: Promise<{ matchId?: string }>
}) {
  const { matchId } = await searchParams

  return (
    <div className="stack">
      <section className="panel">
        <h2 className="page-title">预测广场</h2>
        <p className="muted">平台 / 专家 / AI / 网友 · 先看摘要再解锁</p>
      </section>
      <PredictFeedClient initialMatchId={matchId} />
    </div>
  )
}
