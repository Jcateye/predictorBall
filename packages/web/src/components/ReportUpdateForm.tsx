'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { getToken } from '@/lib/auth-storage'

export function ReportUpdateForm({
  reportId,
  onCreated,
}: {
  reportId: string
  onCreated: () => void
}) {
  const [content, setContent] = useState('')
  const [level, setLevel] = useState<'major' | 'minor'>('minor')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const token = getToken()
    if (!token) {
      setStatus('请先登录后再提交更新')
      return
    }
    if (!content.trim()) {
      setStatus('请填写更新内容')
      return
    }

    setLoading(true)
    setStatus('')
    try {
      await apiClient(`/reports/${reportId}/updates`, {
        method: 'POST',
        token,
        body: JSON.stringify({
          content: content.trim(),
          level,
        }),
      })
      setContent('')
      setStatus('更新已提交')
      onCreated()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '提交失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel stack">
      <h3>提交临场更新</h3>
      <label>
        更新级别：
        <select
          className="input"
          value={level}
          onChange={(event) => setLevel(event.target.value as 'major' | 'minor')}
        >
          <option value="major">重点更新</option>
          <option value="minor">常规更新</option>
        </select>
      </label>
      <textarea
        className="input"
        rows={3}
        value={content}
        placeholder="例如：18:45 首发确认，已纳入模型判断"
        onChange={(event) => setContent(event.target.value)}
      />
      <button type="button" className="btn" onClick={submit} disabled={loading}>
        {loading ? '提交中...' : '提交更新'}
      </button>
      {status ? <p className={status.includes('已提交') ? 'status-ok' : 'status-error'}>{status}</p> : null}
    </section>
  )
}
