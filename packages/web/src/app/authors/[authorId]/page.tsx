import Link from 'next/link'
import { StatusBar } from '@/components/sections/StatusBar'
import { TypeBadge } from '@/components/common/TypeBadge'
import { CtaButton } from '@/components/common/CtaButton'
import { AppIcon } from '@/components/common/AppIcon'
import { Avatar } from '@/components/common/Avatar'
import { authorDiscussionPlaceholder, authorProfiles, authorReportsById } from '@/mocks/authors'

export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ authorId: string }>
  searchParams: Promise<{ tab?: 'reports' | 'stats' | 'discussion' }>
}) {
  const { authorId } = await params
  const { tab = 'reports' } = await searchParams
  const profile = authorProfiles[authorId] ?? authorProfiles['author-zhangwei']
  const reports = authorReportsById[authorId] ?? authorReportsById['author-zhangwei']

  return (
    <div>
      <StatusBar />
      <div className="screen-content space-y-4">
        <div className="flex items-center justify-between py-1 text-[14px] uppercase tracking-[2px] text-text-secondary">
          <button type="button" aria-label="返回上一页"><AppIcon name="chevron-left" /></button>
          <span>作者主页</span>
          <button type="button" aria-label="分享"><AppIcon name="share-2" /></button>
        </div>

        <section className="section-card space-y-4 p-5">
          <div className="flex items-center gap-4">
            <Avatar name={profile.name} size={56} />
            <div className="space-y-1">
              <h1 className="font-heading text-[24px] uppercase tracking-[1px] text-text-primary">{profile.name}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge type="expert" text={profile.badgeText} />
                <span className="text-[12px] text-text-secondary">擅长：{profile.specialties.join(' · ')}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <CtaButton className="flex-1">关注</CtaButton>
            <CtaButton tone="ghost" className="flex-1">订阅</CtaButton>
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-[13px] uppercase tracking-[4px] text-accent-gold">历史战绩</p>
          <div className="grid grid-cols-3 gap-2">
            <article className="section-card border-accent-gold p-3 text-center">
              <p className="font-heading text-[22px] text-text-primary">{profile.weekHit.split(' ')[0]}</p>
              <p className="text-[11px] text-text-secondary">{profile.weekHit.split(' ')[1]}</p>
              <p className="text-[10px] text-text-muted">近7天命中</p>
            </article>
            <article className="section-card p-3 text-center">
              <p className="font-heading text-[22px] text-text-primary">{profile.monthHit.split(' ')[0]}</p>
              <p className="text-[11px] text-text-secondary">{profile.monthHit.split(' ')[1]}</p>
              <p className="text-[10px] text-text-muted">近30天命中</p>
            </article>
            <article className="section-card p-3 text-center">
              <p className="font-heading text-[22px] text-text-primary">{profile.totalReports}</p>
              <p className="text-[10px] text-text-muted">{profile.streak}</p>
            </article>
          </div>
        </section>

        <section className="grid grid-cols-3">
          {(['reports', 'stats', 'discussion'] as const).map((tabItem) => (
            <Link
              key={tabItem}
              href={`/authors/${profile.id}?tab=${tabItem}`}
              className={`border-b py-3 text-center text-[12px] uppercase tracking-[1px] ${
                tab === tabItem ? 'border-accent-gold text-accent-gold' : 'border-border-subtle text-text-secondary'
              }`}
            >
              {tabItem === 'reports' ? '报告' : tabItem === 'stats' ? '战绩' : '讨论'}
            </Link>
          ))}
        </section>

        {tab === 'stats' ? (
          <section className="section-card space-y-2 p-4 text-[12px] text-text-secondary">
            <p>近7天命中：{profile.weekHit}</p>
            <p>近30天命中：{profile.monthHit}</p>
            <p>累计报告：{profile.totalReports}</p>
            <p>{profile.streak}</p>
          </section>
        ) : null}

        {tab === 'discussion' ? (
          <section className="section-card p-4 text-[12px] text-text-secondary">{authorDiscussionPlaceholder}</section>
        ) : null}

        {tab === 'reports' ? (
          <section className="space-y-3 pb-3">
            {reports.map((report) => (
              <article key={report.id} className="section-card space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-text-primary">{report.title}</p>
                  <span className="text-[12px] text-text-secondary">{report.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase tracking-[1px] ${
                      report.type === '临场更新'
                        ? 'bg-accent-red text-text-primary'
                        : report.price === 'FREE'
                          ? 'bg-accent-green text-bg-primary'
                          : 'bg-bg-muted text-text-secondary'
                    }`}
                  >
                    {report.type}
                  </span>
                </div>
                <p className="text-[12px] text-text-secondary">{report.summary}</p>
              </article>
            ))}
          </section>
        ) : null}
      </div>
    </div>
  )
}
