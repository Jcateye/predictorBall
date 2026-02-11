import type { AuthorType } from '@/mocks/types'

const toneByType: Record<AuthorType, string> = {
  platform: 'border-accent-gold text-accent-gold',
  expert: 'border-accent-gold text-accent-gold',
  ai: 'border-accent-blue text-accent-blue',
  user: 'border-text-muted text-text-muted',
}

export function TypeBadge({ type, text }: { type: AuthorType; text: string }) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 text-[11px] uppercase tracking-[1px] ${toneByType[type]}`}
      style={type === 'platform' ? { borderWidth: 2 } : undefined}
    >
      {text}
    </span>
  )
}
