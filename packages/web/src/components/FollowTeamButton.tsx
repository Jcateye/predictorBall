'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { getToken } from '@/lib/auth-storage'

export function FollowTeamButton({
  teamId,
  label,
}: {
  teamId: string
  label: string
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
      await apiClient(`/follows/teams/${teamId}`, {
        method: 'POST',
        token,
      })
      setStatus('已关注')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '关注失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row">
      <button type="button" className="btn btn-outline" onClick={follow} disabled={loading}>
        {loading ? '处理中...' : `关注 ${label}`}
      </button>
      {status ? <small className={status === '已关注' ? 'status-ok' : 'status-error'}>{status}</small> : null}
    </div>
  )
}
