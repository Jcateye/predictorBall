import type { ApiResponse } from '@predictor-ball/shared'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function apiClient<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const withPrefix =
    path.startsWith('/v1') || path === '/health' ? path : `/v1${path}`
  const url = `${API_BASE_URL}/api${withPrefix}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({})) as ApiResponse<never>
    throw new Error(errorBody.error ?? `Request failed: ${response.status}`)
  }

  const json = await response.json() as ApiResponse<T>

  if (!json.success) {
    throw new Error(json.error ?? 'Unknown error')
  }

  return json.data as T
}

export async function publicApiClient<T>(path: string): Promise<T> {
  return apiClient<T>(path)
}
