function getInitials(name: string): string {
  const text = name.trim()
  if (!text) return 'PB'
  if (/[\u4e00-\u9fff]/.test(text)) return text.slice(0, 2)
  return text
    .split(/\s+/)
    .map((item) => item[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function Avatar({
  name,
  size = 24,
}: {
  name: string
  size?: 24 | 28 | 56
}) {
  const textClass = size === 56 ? 'text-[14px]' : 'text-[10px]'

  return (
    <span
      className={`inline-flex items-center justify-center border border-border-subtle bg-bg-muted text-text-secondary ${textClass}`}
      style={{ width: size, height: size }}
      aria-label={`${name} 头像`}
      title={name}
    >
      {getInitials(name)}
    </span>
  )
}
