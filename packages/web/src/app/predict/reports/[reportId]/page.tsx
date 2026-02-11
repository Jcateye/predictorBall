import { ReportDetailClient } from '@/components/ReportDetailClient'

export default async function ReportPage({
  params,
}: {
  params: Promise<{ reportId: string }>
}) {
  const { reportId } = await params

  return (
    <div className="stack">
      <section className="panel">
        <h2 className="page-title">预测报告详情</h2>
      </section>
      <ReportDetailClient reportId={reportId} />
    </div>
  )
}
