'use client'

import { useEffect, useState } from 'react'
import type { EntitlementDto } from '@predictor-ball/shared'
import { apiClient } from '@/lib/api-client'
import { getToken } from '@/lib/auth-storage'

export function EntitlementsPanel() {
  const [list, setList] = useState<EntitlementDto[]>([])
  const [status, setStatus] = useState<string>('加载中...')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setStatus('未登录，无法查看已购报告')
      return
    }

    void (async () => {
      try {
        const response = await apiClient<EntitlementDto[]>('/me/entitlements', { token })
        setList(response)
        setStatus(response.length > 0 ? '' : '暂无已购报告')
      } catch (error) {
        setStatus(error instanceof Error ? error.message : '查询失败')
      }
    })()
  }, [])

  return (
    <section className="panel">
      <h3>我的已购</h3>
      {status ? <p className="muted">{status}</p> : null}
      <ul className="plain-list">
        {list.map((item) => (
          <li key={item.id}>
            报告ID：{item.reportId} · 解锁时间：{new Date(item.grantedAt).toLocaleString('zh-CN')}
          </li>
        ))}
      </ul>
    </section>
  )
}
