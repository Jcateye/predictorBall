import Link from 'next/link'
import type { FeedItem } from '@predictor-ball/shared'
import { AuthorBadge } from './AuthorBadge'

export function FeedCard({ item }: { item: FeedItem }) {
  return (
    <article className="panel feed-card">
      <div className="row">
        <div>
          <Link href={`/authors/${item.author.id}`} className="text-link">
            {item.author.nickname}
          </Link>
          <AuthorBadge type={item.author.type} />
        </div>
        <small>
          7日命中 {item.author.hitRate7d.hit}/{item.author.hitRate7d.total}
        </small>
      </div>
      <h3>{item.title}</h3>
      <p className="muted">
        {item.match.homeTeam.name} vs {item.match.awayTeam.name} · {item.match.stage}
      </p>
      <ul className="plain-list">
        {item.summary.map((summary) => (
          <li key={summary}>{summary}</li>
        ))}
      </ul>
      <div className="row">
        <small>{item.priceType === 'free' ? '免费' : `¥${item.price.toFixed(1)}`}</small>
        <Link href={`/predict/reports/${item.id}`} className="text-link">
          查看详情
        </Link>
      </div>
    </article>
  )
}
