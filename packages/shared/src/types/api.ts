export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: ResponseMeta
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ResponseMeta extends Partial<PaginationMeta> {
  requestId?: string
  serverTime?: string
}

export interface HealthCheckResponse {
  status: 'ok' | 'error'
  timestamp: string
  service: string
}
