interface HitRateStatProps {
  title: string
  hit: number
  total: number
}

export function HitRateStat({ title, hit, total }: HitRateStatProps) {
  const rate = total > 0 ? `${Math.round((hit / total) * 100)}%` : '--'
  return (
    <div className="stat-card">
      <p>{title}</p>
      <strong>{rate}</strong>
      <small>
        {hit}/{total}
      </small>
    </div>
  )
}
