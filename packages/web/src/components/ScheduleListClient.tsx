'use client'

import { useEffect, useMemo, useState } from 'react'
import type { MatchCard, MatchStatus } from '@predictor-ball/shared'
import { apiClient } from '@/lib/api-client'
import { MatchCard as MatchCardComponent } from './MatchCard'

interface ScheduleFilters {
  status: MatchStatus | ''
  stage: string
  groupCode: string
  timeWindow: 'today' | 'tomorrow' | 'this_week' | ''
}

export function ScheduleListClient() {
  const [filters, setFilters] = useState<ScheduleFilters>({
    status: '',
    stage: '',
    groupCode: '',
    timeWindow: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState<MatchCard[]>([])

  const query = useMemo(() => {
    const params = new URLSearchParams()
    params.set('limit', '50')
    if (filters.status) {
      params.set('status', filters.status)
    }
    if (filters.stage.trim()) {
      params.set('stage', filters.stage.trim())
    }
    if (filters.groupCode.trim()) {
      params.set('groupCode', filters.groupCode.trim())
    }
    if (filters.timeWindow) {
      params.set('timeWindow', filters.timeWindow)
    }
    return params.toString()
  }, [filters])

  useEffect(() => {
    void (async () => {
      setLoading(true)
      setError('')
      try {
        const response = await apiClient<MatchCard[]>(`/schedule?${query}`)
        setItems(response)
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : '加载失败')
      } finally {
        setLoading(false)
      }
    })()
  }, [query])

  return (
    <div className="stack">
      <section className="panel">
        <div className="filter-grid">
          <label>
            状态：
            <select
              className="input"
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  status: event.target.value as ScheduleFilters['status'],
                }))
              }
            >
              <option value="">全部</option>
              <option value="scheduled">未开赛</option>
              <option value="live">进行中</option>
              <option value="finished">已结束</option>
              <option value="postponed">延期</option>
            </select>
          </label>
          <label>
            阶段：
            <input
              className="input"
              value={filters.stage}
              placeholder="小组赛 / 淘汰赛"
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  stage: event.target.value,
                }))
              }
            />
          </label>
          <label>
            小组：
            <input
              className="input"
              value={filters.groupCode}
              placeholder="A ~ H"
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  groupCode: event.target.value.toUpperCase(),
                }))
              }
            />
          </label>
          <label>
            日期：
            <select
              className="input"
              value={filters.timeWindow}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  timeWindow: event.target.value as ScheduleFilters['timeWindow'],
                }))
              }
            >
              <option value="">全部</option>
              <option value="today">今天</option>
              <option value="tomorrow">明天</option>
              <option value="this_week">本周</option>
            </select>
          </label>
        </div>
      </section>

      {loading ? <p className="muted">加载中...</p> : null}
      {error ? <p className="status-error">{error}</p> : null}
      {!loading && !error && items.length === 0 ? <p className="muted">暂无匹配赛程</p> : null}
      {items.map((match) => (
        <MatchCardComponent key={match.id} match={match} href={`/matches/${match.id}`} />
      ))}
    </div>
  )
}
