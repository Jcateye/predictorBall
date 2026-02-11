'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  type AuthorType,
  type FeedItem,
  type PriceType,
  type ReportType,
} from '@predictor-ball/shared'
import { apiClient } from '@/lib/api-client'
import { FeedCard } from './FeedCard'

interface FeedResponseData {
  items: FeedItem[]
  userId?: string
}

type SortMode = 'recommended' | 'latest' | 'hot' | 'hit_rate'

interface FeedFilters {
  matchId: string
  authorType: AuthorType | ''
  priceType: PriceType | ''
  type: ReportType | ''
  stage: string
  groupCode: string
  timeWindow: 'today' | 'tomorrow' | 'this_week' | ''
  sort: SortMode
  search: string
}

export function PredictFeedClient({ initialMatchId = '' }: { initialMatchId?: string }) {
  const [filters, setFilters] = useState<FeedFilters>({
    matchId: initialMatchId,
    authorType: '',
    priceType: '',
    type: '',
    stage: '',
    groupCode: '',
    timeWindow: '',
    sort: 'recommended',
    search: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [items, setItems] = useState<FeedItem[]>([])

  const query = useMemo(() => {
    const params = new URLSearchParams()
    params.set('sort', filters.sort)
    if (filters.matchId) {
      params.set('matchId', filters.matchId)
    }
    if (filters.authorType) {
      params.set('authorType', filters.authorType)
    }
    if (filters.priceType) {
      params.set('priceType', filters.priceType)
    }
    if (filters.type) {
      params.set('type', filters.type)
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
    if (filters.search.trim()) {
      params.set('search', filters.search.trim())
    }
    return params.toString()
  }, [filters])

  const loadFeed = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiClient<FeedResponseData>(`/feed?${query}`)
      setItems(response.items)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadFeed()
  }, [query])

  return (
    <div className="stack">
      <section className="panel stack">
        <div className="filter-grid">
          <label>
            作者类型：
            <select
              className="input"
              value={filters.authorType}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  authorType: event.target.value as FeedFilters['authorType'],
                }))
              }
            >
              <option value="">全部</option>
              <option value="platform">平台</option>
              <option value="expert">专家</option>
              <option value="ai">AI</option>
              <option value="user">网友</option>
            </select>
          </label>
          <label>
            价格：
            <select
              className="input"
              value={filters.priceType}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  priceType: event.target.value as FeedFilters['priceType'],
                }))
              }
            >
              <option value="">全部</option>
              <option value="free">免费</option>
              <option value="paid">付费</option>
            </select>
          </label>
          <label>
            报告类型：
            <select
              className="input"
              value={filters.type}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  type: event.target.value as FeedFilters['type'],
                }))
              }
            >
              <option value="">全部</option>
              <option value="pre_match">赛前分析</option>
              <option value="live_update">临场更新</option>
              <option value="in_play">赛中观点</option>
              <option value="review">复盘</option>
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
            时间窗：
            <select
              className="input"
              value={filters.timeWindow}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  timeWindow: event.target.value as FeedFilters['timeWindow'],
                }))
              }
            >
              <option value="">全部</option>
              <option value="today">今天</option>
              <option value="tomorrow">明天</option>
              <option value="this_week">本周</option>
            </select>
          </label>
          <label>
            排序：
            <select
              className="input"
              value={filters.sort}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  sort: event.target.value as SortMode,
                }))
              }
            >
              <option value="recommended">推荐</option>
              <option value="latest">最新</option>
              <option value="hot">热度</option>
              <option value="hit_rate">命中率</option>
            </select>
          </label>
          <label>
            搜索：
            <input
              className="input"
              value={filters.search}
              placeholder="球队 / 比赛 / 作者"
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                }))
              }
            />
          </label>
        </div>
      </section>

      {loading ? <p className="muted">加载中...</p> : null}
      {error ? <p className="status-error">{error}</p> : null}
      {!loading && !error && items.length === 0 ? <p className="muted">暂无匹配报告</p> : null}
      {items.map((item) => (
        <FeedCard key={item.id} item={item} />
      ))}
    </div>
  )
}
