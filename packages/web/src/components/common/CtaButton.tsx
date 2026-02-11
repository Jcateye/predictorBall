export function CtaButton({
  children,
  tone = 'gold',
  className = '',
}: {
  children: React.ReactNode
  tone?: 'gold' | 'green' | 'ghost'
  className?: string
}) {
  const toneClass =
    tone === 'gold'
      ? 'bg-accent-gold text-bg-primary border-accent-gold'
      : tone === 'green'
        ? 'bg-accent-green text-bg-primary border-accent-green'
        : 'bg-transparent text-accent-gold border-accent-gold'

  return (
    <button type="button" className={`border px-3 py-2 text-[12px] uppercase tracking-[1px] ${toneClass} ${className}`}>
      {children}
    </button>
  )
}
