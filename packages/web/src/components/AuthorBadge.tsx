import type { AuthorType } from '@predictor-ball/shared'

const LABEL_MAP: Record<AuthorType, string> = {
  platform: '平台',
  expert: '专家',
  ai: 'AI',
  user: '网友',
}

export function AuthorBadge({ type }: { type: AuthorType }) {
  return <span className={`author-badge author-${type}`}>{LABEL_MAP[type]}</span>
}
