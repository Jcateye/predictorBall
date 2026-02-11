import { randomUUID } from 'node:crypto'
import type { ApiResponse, ResponseMeta } from '@predictor-ball/shared'

export function successResponse<T>(
  data: T,
  meta: Partial<ResponseMeta> = {},
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      requestId: randomUUID(),
      serverTime: new Date().toISOString(),
      ...meta,
    },
  }
}

export function errorResponse(message: string): ApiResponse<never> {
  return {
    success: false,
    error: message,
    meta: {
      requestId: randomUUID(),
      serverTime: new Date().toISOString(),
    },
  }
}
