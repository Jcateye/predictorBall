import { ScheduleListClient } from '@/components/ScheduleListClient'

export default async function SchedulePage() {
  return (
    <div className="stack">
      <section className="panel">
        <h2 className="page-title">赛程</h2>
        <p className="muted">支持状态/阶段/分组/日期筛选（MVP 首版）</p>
      </section>
      <ScheduleListClient />
    </div>
  )
}
