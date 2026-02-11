import { StatusBar } from '@/components/sections/StatusBar'
import { liveDetailById } from '@/mocks/live'
import { CtaButton } from '@/components/common/CtaButton'
import { AppIcon } from '@/components/common/AppIcon'

export function generateStaticParams() {
  return Object.keys(liveDetailById).map((matchId) => ({ matchId }))
}

export default async function LiveDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params
  const detail = liveDetailById[matchId] ?? liveDetailById['live-fr-br']

  return (
    <div>
      <StatusBar />
      <div className="screen-content space-y-4">
        <div className="flex items-center justify-between py-1 text-[14px] uppercase tracking-[2px] text-text-secondary">
          <button type="button" aria-label="返回上一页"><AppIcon name="chevron-left" /></button>
          <span>比赛实况</span>
          <button type="button" aria-label="分享"><AppIcon name="share-2" /></button>
        </div>

        <section className="section-card p-5">
          <div className="mb-2 flex items-center justify-between text-[15px] text-text-primary">
            <span>{detail.match.home.name}</span>
            <span>{detail.match.away.name}</span>
          </div>
          <div className="mb-1 text-center font-heading text-[48px] leading-none tracking-[1px] text-text-primary">{detail.scoreLabel}</div>
          <p className="text-center text-[12px] uppercase tracking-[1px] text-accent-gold">{detail.matchMeta}</p>
        </section>

        <section className="section-card p-4">
          <h3 className="mb-3 text-[14px] uppercase tracking-[3px] text-accent-gold">关键事件</h3>
          <div className="space-y-2">
            {detail.events.map((event) => (
              <div key={event.id} className="flex items-start gap-2 text-[13px] text-text-secondary">
                <span className="w-10 text-accent-gold">{event.minute}'</span>
                <span>{event.type}</span>
                <span className="text-text-primary">{event.player}</span>
                <span>{event.detail}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section-card p-4">
          <h3 className="mb-3 text-[14px] uppercase tracking-[3px] text-accent-gold">技术统计</h3>
          <div className="space-y-3">
            {detail.stats.map((item) => {
              const total = item.home + item.away
              const homeRate = total > 0 ? Math.round((item.home / total) * 100) : 0
              const awayRate = 100 - homeRate
              return (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-[12px] text-text-secondary">
                    <span>{item.home}{item.suffix ?? ''}</span>
                    <span className="uppercase tracking-[1px]">{item.label}</span>
                    <span>{item.away}{item.suffix ?? ''}</span>
                  </div>
                  <div className="flex h-1.5 overflow-hidden bg-bg-muted">
                    <div className="bg-accent-gold" style={{ width: `${homeRate}%` }} />
                    <div className="bg-border-divider" style={{ width: `${awayRate}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="section-card space-y-3 p-4">
          <h3 className="text-[14px] uppercase tracking-[3px] text-accent-gold">赛中观点</h3>
          <p className="text-[13px] text-text-secondary">{detail.proInsight.freeSummary}</p>
          <div className="space-y-1 text-[12px] text-text-muted">
            {detail.proInsight.lockedItems.map((item) => (
              <p key={item}>🔒 {item}</p>
            ))}
          </div>
          <CtaButton className="w-full">{detail.proInsight.cta}</CtaButton>
        </section>
      </div>
    </div>
  )
}
