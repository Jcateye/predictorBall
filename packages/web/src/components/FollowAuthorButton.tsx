'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { getToken } from '@/lib/auth-storage'

export function FollowAuthorButton({ authorId }: { authorId: string }) {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const follow = async () => {
    const token = getToken()
    if (!token) {
      setStatus('请先登录后关注')
      return
    }

    setLoading(true)
    setStatus('')
    try {
      await apiClient(`/follows/authors/${authorId}`, {
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
      <button type="button" className="btn" onClick={follow} disabled={loading}>
        {loading ? '处理中...' : '关注'}
      </button>
      {status ? <small className={status === '已关注' ? 'status-ok' : 'status-error'}>{status}</small> : null}
    </div>
  )
}
