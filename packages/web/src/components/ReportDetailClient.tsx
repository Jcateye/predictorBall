'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type {
  FeedItem,
  ReportDetailDto,
  ReportRecommendationsDto,
  ReportUpdateDto,
} from '@predictor-ball/shared'
import { apiClient } from '@/lib/api-client'
import { getToken } from '@/lib/auth-storage'
import { AuthorBadge } from './AuthorBadge'
import { LockedSection } from './LockedSection'
import { PaymentSheet } from './PaymentSheet'
import { ReportUpdateForm } from './ReportUpdateForm'

export function ReportDetailClient({ reportId }: { reportId: string }) {
  const [detail, setDetail] = useState<ReportDetailDto | null>(null)
  const [updates, setUpdates] = useState<ReportUpdateDto[]>([])
  const [recommendations, setRecommendations] = useState<ReportRecommendationsDto>({
    sameMatch: [],
    moreFromAuthor: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getToken() ?? undefined
      const [report, reportUpdates, reportRecommendations] = await Promise.all([
        apiClient<ReportDetailDto>(`/reports/${reportId}`, { token }),
        apiClient<ReportUpdateDto[]>(`/reports/${reportId}/updates`),
        apiClient<ReportRecommendationsDto>(`/reports/${reportId}/recommendations`),
      ])
      setDetail(report)
      setUpdates(reportUpdates)
      setRecommendations(reportRecommendations)
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : '报告加载失败，请重试'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [reportId])

  if (loading) {
    return <p>加载中...</p>
  }

  if (error || !detail) {
    return <p className="status-error">{error ?? '报告不存在'}</p>
  }

  return (
    <div className="stack">
      <section className="panel">
        <h2>{detail.title}</h2>
        <p className="muted">
          {detail.match.homeTeam.name} vs {detail.match.awayTeam.name} · {detail.match.stage}
        </p>
        <div className="row">
          <span>{detail.author.nickname}</span>
          <AuthorBadge type={detail.author.type} />
        </div>
        <small>更新于 {new Date(detail.updatedAt).toLocaleString('zh-CN')}</small>
      </section>

      <section className="panel">
        <h3>一眼看懂理由</h3>
        <ul className="plain-list">
          {detail.freeReasons.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h3>更新记录</h3>
        <ul className="plain-list">
          {updates.length > 0 ? (
            updates.map((update) => (
              <li key={update.id}>
                <strong>{new Date(update.timestamp).toLocaleTimeString('zh-CN')}</strong> ·{' '}
                {update.level === 'major' ? '重点更新' : '常规更新'} · {update.content}
              </li>
            ))
          ) : (
            <li>暂无更新记录</li>
          )}
        </ul>
      </section>

      <ReportUpdateForm reportId={reportId} onCreated={load} />

      <LockedSection title="锁定目录" items={detail.lockedOutline} unlocked={detail.hasEntitlement} />

      {detail.hasEntitlement && detail.lockedContent ? (
        <section className="panel">
          <h3>已解锁内容</h3>
          <p>{detail.lockedContent.conclusion}</p>
          <p>置信度：{detail.lockedContent.confidence}</p>
          <ul className="plain-list">
            {detail.lockedContent.keyVariables.map((item) => (
              <li key={item}>关键变量：{item}</li>
            ))}
          </ul>
          <ul className="plain-list">
            {detail.lockedContent.riskReversal.map((item) => (
              <li key={item}>反转条件：{item}</li>
            ))}
          </ul>
        </section>
      ) : detail.priceType === 'paid' ? (
        <PaymentSheet reportId={detail.id} price={detail.price} onPaid={load} />
      ) : null}

      {detail.aiDisclaimer ? <p className="muted">{detail.aiDisclaimer}</p> : null}

      <section className="panel">
        <h3>同场更多报告</h3>
        <RecommendationList items={recommendations.sameMatch} />
      </section>

      <section className="panel">
        <h3>更多来自 TA</h3>
        <RecommendationList items={recommendations.moreFromAuthor} />
      </section>
    </div>
  )
}

function RecommendationList({ items }: { items: FeedItem[] }) {
  if (items.length === 0) {
    return <p className="muted">暂无推荐</p>
  }

  return (
    <ul className="plain-list">
      {items.map((item) => (
        <li key={item.id}>
          <Link href={`/predict/reports/${item.id}`} className="text-link">
            {item.title}
          </Link>{' '}
          · {item.priceType === 'free' ? '免费' : `¥${item.price.toFixed(1)}`}
        </li>
      ))}
    </ul>
  )
}
