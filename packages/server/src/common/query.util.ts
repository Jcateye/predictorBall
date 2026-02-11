import { DEFAULT_PAGINATION } from '@predictor-ball/shared'

export function toPage(value?: string): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : DEFAULT_PAGINATION.PAGE
}

export function toLimit(value?: string): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_PAGINATION.LIMIT
  }

  return Math.min(Math.floor(parsed), DEFAULT_PAGINATION.MAX_LIMIT)
}
