'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { getToken } from '@/lib/auth-storage'

export function FollowMatchButton({
  matchId,
}: {
  matchId: string
}) {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const follow = async () => {
    const token = getToken()
    if (!token) {
      setStatus('请先登录')
      return
    }
    setLoading(true)
    setStatus('')
    try {
      await apiClient(`/follows/matches/${matchId}`, {
        method: 'POST',
        token,
      })
      setStatus('已关注比赛')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row">
      <button type="button" className="btn" onClick={follow} disabled={loading}>
        {loading ? '处理中...' : '关注比赛'}
      </button>
      {status ? <small className={status.includes('已关注') ? 'status-ok' : 'status-error'}>{status}</small> : null}
    </div>
  )
}
