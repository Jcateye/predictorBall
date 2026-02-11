'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { FollowDto } from '@predictor-ball/shared'
import { apiClient } from '@/lib/api-client'
import { getToken } from '@/lib/auth-storage'

export function FollowsPanel() {
  const [follows, setFollows] = useState<FollowDto[]>([])
  const [status, setStatus] = useState('加载中...')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setStatus('未登录，无法查看关注')
      return
    }

    void (async () => {
      try {
        const response = await apiClient<FollowDto[]>('/me/follows', { token })
        setFollows(response)
        setStatus(response.length > 0 ? '' : '暂无关注')
      } catch (error) {
        setStatus(error instanceof Error ? error.message : '加载失败')
      }
    })()
  }, [])

  return (
    <section className="panel">
      <h3>我的关注</h3>
      {status ? <p className="muted">{status}</p> : null}
      <ul className="plain-list">
        {follows.map((follow) => (
          <li key={follow.id}>
            {follow.targetType === 'author' ? (
              <Link href={`/authors/${follow.targetId}`} className="text-link">
                作者：{follow.targetName ?? follow.targetId}
              </Link>
            ) : follow.targetType === 'match' ? (
              <Link href={`/matches/${follow.targetId}`} className="text-link">
                比赛：{follow.targetName ?? follow.targetId}
              </Link>
            ) : (
              <span>球队：{follow.targetName ?? follow.targetId}</span>
            )}{' '}
            · {new Date(follow.createdAt).toLocaleString('zh-CN')}
          </li>
        ))}
      </ul>
    </section>
  )
}
