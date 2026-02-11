'use client'

const TOKEN_KEY = 'predictor_ball_token'
const USER_KEY = 'predictor_ball_user'

export interface StoredUser {
  id: string
  nickname: string
}

export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): StoredUser | null {
  if (typeof window === 'undefined') {
    return null
  }
  const value = localStorage.getItem(USER_KEY)
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as StoredUser
  } catch {
    return null
  }
}

export function setAuth(token: string, user: StoredUser): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
