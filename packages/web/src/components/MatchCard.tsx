import Link from 'next/link'
import type { MatchCard as MatchCardDto } from '@predictor-ball/shared'

interface MatchCardProps {
  match: MatchCardDto
  href?: string
}

function statusText(match: MatchCardDto): string {
  if (match.status === 'live') {
    return `${match.minute ?? 0}' LIVE`
  }
  if (match.status === 'finished') {
    return '已结束'
  }
  if (match.status === 'postponed') {
    return '延期'
  }
  return '未开赛'
}

export function MatchCard({ match, href }: MatchCardProps) {
  const content = (
    <article className="panel match-card">
      <div className="row">
        <strong>
          {match.homeTeam.name} vs {match.awayTeam.name}
        </strong>
        <span>{statusText(match)}</span>
      </div>
      <div className="row">
        <span>
          {match.stage}
          {match.groupCode ? ` · ${match.groupCode}组` : ''}
        </span>
        <span>
          {match.homeScore} - {match.awayScore}
        </span>
      </div>
      <small>{new Date(match.kickoffAt).toLocaleString('zh-CN')}</small>
    </article>
  )

  if (!href) {
    return content
  }

  return (
    <Link href={href} className="block-link">
      {content}
    </Link>
  )
}
