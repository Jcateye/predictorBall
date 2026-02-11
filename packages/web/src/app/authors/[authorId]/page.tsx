import Link from 'next/link'
import type { AuthorProfileDto, FeedItem } from '@predictor-ball/shared'
import { publicApiClient } from '@/lib/api-client'
import { AuthorBadge } from '@/components/AuthorBadge'
import { FeedCard } from '@/components/FeedCard'
import { HitRateStat } from '@/components/HitRateStat'
import { FollowAuthorButton } from '@/components/FollowAuthorButton'

export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ authorId: string }>
  searchParams: Promise<{ tab?: 'reports' | 'stats' | 'discussion' }>
}) {
  const { authorId } = await params
  const { tab = 'reports' } = await searchParams
  const profile = await publicApiClient<AuthorProfileDto>(`/authors/${authorId}`)
  const reports = await publicApiClient<FeedItem[]>(`/authors/${authorId}/reports`)

  return (
    <div className="stack">
      <section className="panel">
        <h2 className="page-title">{profile.nickname}</h2>
        <div className="row">
          <AuthorBadge type={profile.type} />
          <span className="muted">{profile.tags.join(' · ')}</span>
        </div>
        <FollowAuthorButton authorId={profile.id} />
      </section>

      <section className="panel">
        <div className="row">
          <Link href={`/authors/${authorId}?tab=reports`} className="text-link">
            报告
          </Link>
          <Link href={`/authors/${authorId}?tab=stats`} className="text-link">
            战绩
          </Link>
          <Link href={`/authors/${authorId}?tab=discussion`} className="text-link">
            讨论
          </Link>
        </div>
      </section>

      {tab === 'stats' ? (
        <section className="panel">
          <h3>历史战绩</h3>
          <div className="stat-grid">
            <HitRateStat title="近7天命中" hit={profile.hitRate7d.hit} total={profile.hitRate7d.total} />
            <HitRateStat
              title="近30天命中"
              hit={profile.hitRate30d.hit}
              total={profile.hitRate30d.total}
            />
            <div className="stat-card">
              <p>累计报告</p>
              <strong>{profile.totalReports}</strong>
              <small>最长连红 {profile.streakBest ?? 0}</small>
            </div>
          </div>
        </section>
      ) : null}

      {tab === 'discussion' ? (
        <section className="panel">
          <h3>讨论区（MVP 占位）</h3>
          <p className="muted">后续将开放评论、点赞、举报、作者回复等互动能力。</p>
        </section>
      ) : null}

      {tab === 'reports' ? (
        <section className="stack">
          {reports.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))}
        </section>
      ) : null}
    </div>
  )
}
