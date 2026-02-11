import Link from 'next/link'
import { StatusBar } from '@/components/sections/StatusBar'
import { reportDetailById } from '@/mocks/predict'
import { TypeBadge } from '@/components/common/TypeBadge'
import { CtaButton } from '@/components/common/CtaButton'
import { AppIcon } from '@/components/common/AppIcon'
import { Avatar } from '@/components/common/Avatar'

export function generateStaticParams() {
  return Object.keys(reportDetailById).map((reportId) => ({ reportId }))
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ reportId: string }>
}) {
  const { reportId } = await params
  const report = reportDetailById[reportId] ?? reportDetailById['report-fr-br-expert']

  return (
    <div>
      <StatusBar />
      <div className="screen-content space-y-4">
        <div className="flex items-center justify-between py-1 text-[14px] uppercase tracking-[2px] text-text-secondary">
          <button type="button" aria-label="返回上一页"><AppIcon name="chevron-left" /></button>
          <span>预测报告</span>
          <button type="button" aria-label="分享"><AppIcon name="share-2" /></button>
        </div>

        <section className="section-card space-y-2 p-5">
          <h1 className="font-heading text-[24px] uppercase tracking-[1px] text-text-primary">{report.title}</h1>
          <p className="text-[13px] text-text-secondary">{report.subtitle}</p>
          <p className="text-[11px] uppercase tracking-[1px] text-accent-gold">{report.updateTag}</p>
        </section>

        <section className="section-card flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Avatar name={report.author.name} size={28} />
            <p className="text-[13px] text-text-primary">{report.author.name}</p>
            <TypeBadge
              type={report.author.type}
              text={{ platform: '平台', expert: '专家', ai: 'AI', user: '网友' }[report.author.type]}
            />
          </div>
          <span className="text-[11px] text-text-secondary">{report.author.hitRate}</span>
        </section>

        <section className="section-card space-y-2 p-4">
          <h2 className="text-[13px] uppercase tracking-[2px] text-accent-gold">更新记录</h2>
          {report.updateLog.map((item) => (
            <div key={`${item.time}-${item.content}`} className="flex items-start gap-2 text-[12px] text-text-secondary">
              <span className={item.latest ? 'text-accent-gold' : 'text-text-muted'}>●</span>
              <p>
                <span className="mr-2 text-text-primary">{item.time}</span>
                {item.content}
              </p>
            </div>
          ))}
        </section>

        <section className="section-card space-y-2 p-4">
          <h2 className="text-[13px] uppercase tracking-[2px] text-accent-gold">报告目录</h2>
          {report.toc.map((item) => (
            <p key={item.label} className="text-[12px] text-text-secondary">
              {item.locked ? '🔒' : '✅'} {item.label}
            </p>
          ))}
        </section>

        <section className="space-y-2">
          <h2 className="text-[13px] uppercase tracking-[2px] text-accent-gold">一眼看懂理由</h2>
          {report.freeReasons.map((reason, index) => (
            <article key={reason} className="section-card p-4 text-[13px] text-text-secondary">
              <span className="mr-2 text-accent-gold">{index + 1}.</span>
              {reason}
            </article>
          ))}
        </section>

        <section className="section-card space-y-3 p-4">
          <h2 className="text-[13px] uppercase tracking-[2px] text-accent-gold">付费区预览</h2>
          {report.lockedPreview.map((item) => (
            <p key={item} className="border border-dashed border-border-subtle bg-bg-muted px-3 py-2 text-[12px] text-text-muted">
              🔒 {item}
            </p>
          ))}
          <CtaButton className="w-full">{report.unlockText}</CtaButton>
          <p className="text-[11px] text-text-muted">首单体验价 · PRO 会员可享更多权益</p>
        </section>

        <section className="space-y-2 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] uppercase tracking-[2px] text-accent-gold">更多来自TA</h2>
            <Link href={`/authors/${report.author.id}`} className="text-[12px] text-accent-gold">
              查看主页
            </Link>
          </div>
          {report.moreFromAuthor.map((item) => (
            <article key={item.id} className="section-card flex items-center justify-between p-3">
              <p className="text-[13px] text-text-primary">{item.title}</p>
              <span className="text-[12px] text-text-secondary">{item.price}</span>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
