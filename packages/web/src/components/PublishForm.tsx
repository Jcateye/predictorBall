'use client'

import { useMemo, useState } from 'react'
import type { MatchCard as MatchCardDto, ReportType } from '@predictor-ball/shared'
import { apiClient } from '@/lib/api-client'
import { getToken } from '@/lib/auth-storage'

interface PublishFormProps {
  matches: MatchCardDto[]
}

const REPORT_TYPES: Array<{ label: string; value: ReportType }> = [
  { label: '赛前分析', value: 'pre_match' },
  { label: '临场更新', value: 'live_update' },
  { label: '赛中观点', value: 'in_play' },
  { label: '复盘', value: 'review' },
]

export function PublishForm({ matches }: PublishFormProps) {
  const defaultMatch = useMemo(() => matches[0]?.id ?? '', [matches])
  const [matchId, setMatchId] = useState(defaultMatch)
  const [type, setType] = useState<ReportType>('pre_match')
  const [summaryText, setSummaryText] = useState('请填写 1-3 条公开摘要，每行一条')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const token = getToken()
    if (!token) {
      setStatus('请先 Mock 登录后再发布')
      return
    }

    const summary = summaryText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)

    setLoading(true)
    setStatus(null)
    try {
      await apiClient('/reports/publish', {
        method: 'POST',
        body: JSON.stringify({
          matchId,
          type,
          summary,
        }),
        token,
      })
      setStatus('发布成功，已进入预测广场（网友免费内容）')
    } catch (error) {
      const message = error instanceof Error ? error.message : '发布失败，请稍后重试'
      setStatus(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel stack">
      <h3>发布网友预测（免费）</h3>
      <label>
        比赛：
        <select
          className="input"
          value={matchId}
          onChange={(event) => setMatchId(event.target.value)}
        >
          {matches.map((match) => (
            <option key={match.id} value={match.id}>
              {match.homeTeam.name} vs {match.awayTeam.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        类型：
        <select className="input" value={type} onChange={(event) => setType(event.target.value as ReportType)}>
          {REPORT_TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        公开摘要（1-3条）：
        <textarea
          className="input"
          rows={5}
          value={summaryText}
          onChange={(event) => setSummaryText(event.target.value)}
        />
      </label>
      <button type="button" className="btn" disabled={loading} onClick={submit}>
        {loading ? '发布中...' : '发布'}
      </button>
      {status ? <p className={status.includes('成功') ? 'status-ok' : 'status-error'}>{status}</p> : null}
      <small className="muted">内容仅供参考，严禁下注引导、返利、代投、拉群等违规行为。</small>
    </section>
  )
}
