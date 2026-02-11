'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { clearAuth, getToken, getUser, setAuth } from '@/lib/auth-storage'

interface MockLoginResponse {
  token: string
  user: {
    id: string
    nickname: string
  }
}

export function AuthPanel() {
  const [token, setToken] = useState<string | null>(null)
  const [nickname, setNickname] = useState('世界杯观察员')
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setToken(getToken())
    setUserName(getUser()?.nickname ?? null)
  }, [])

  const login = async () => {
    setLoading(true)
    try {
      const result = await apiClient<MockLoginResponse>('/auth/mock-login', {
        method: 'POST',
        body: JSON.stringify({ nickname }),
      })
      setAuth(result.token, result.user)
      setToken(result.token)
      setUserName(result.user.nickname)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearAuth()
    setToken(null)
    setUserName(null)
  }

  return (
    <div className="panel auth-panel">
      <div>
        <strong>账号状态：</strong>
        <span>{token ? `已登录（${userName ?? '用户'}）` : '游客模式'}</span>
      </div>
      <div className="auth-actions">
        <input
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="昵称"
          className="input"
        />
        <button type="button" onClick={login} disabled={loading} className="btn">
          {loading ? '登录中...' : 'Mock 登录'}
        </button>
        {token ? (
          <button type="button" onClick={logout} className="btn btn-outline">
            退出
          </button>
        ) : null}
      </div>
    </div>
  )
}
