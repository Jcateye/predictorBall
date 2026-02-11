'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { ReminderDto } from '@predictor-ball/shared'
import { apiClient } from '@/lib/api-client'
import { getToken } from '@/lib/auth-storage'

export function RemindersPanel() {
  const [reminders, setReminders] = useState<ReminderDto[]>([])
  const [status, setStatus] = useState('加载中...')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setStatus('未登录，无法查看提醒')
      return
    }

    void (async () => {
      try {
        const response = await apiClient<ReminderDto[]>('/me/reminders', { token })
        setReminders(response)
        setStatus(response.length > 0 ? '' : '未来24小时暂无提醒')
      } catch (error) {
        setStatus(error instanceof Error ? error.message : '加载失败')
      }
    })()
  }, [])

  return (
    <section className="panel">
      <h3>我的提醒（24小时）</h3>
      {status ? <p className="muted">{status}</p> : null}
      <ul className="plain-list">
        {reminders.map((item) => (
          <li key={item.id}>
            <Link href={`/matches/${item.matchId}`} className="text-link">
              {item.message}
            </Link>{' '}
            · {new Date(item.kickoffAt).toLocaleString('zh-CN')}
          </li>
        ))}
      </ul>
    </section>
  )
}
