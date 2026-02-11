import type { AuthorProfile } from '@/mocks/types'
import { predictCards } from '@/mocks/predict'

export const authorProfiles: Readonly<Record<string, AuthorProfile>> = {
  'author-zhangwei': {
    id: 'author-zhangwei',
    name: '张伟 · 足球研究室',
    badgeText: '专家',
    specialties: ['英超', '国家队', '战术流', '赛果'],
    weekHit: '71% (10/14)',
    monthHit: '62% (42/68)',
    totalReports: '156',
    streak: '最长连红 6',
  },
}

export const authorReportsById: Readonly<Record<string, ReadonlyArray<{ id: string; title: string; type: string; price: string; summary: string }>>> = {
  'author-zhangwei': [
    {
      id: 'report-fr-br-expert',
      title: '法国 vs 巴西 · 赛前分析',
      type: '赛前分析',
      price: '¥9.9',
      summary: '法国边路压迫强度与巴西后场出球质量形成明显对位差。',
    },
    {
      id: 'report-update-1',
      title: '法国 vs 巴西 · 临场更新',
      type: '临场更新',
      price: '¥19.9',
      summary: '首发阵型确认后，节奏判断从中高转为中低。',
    },
    {
      id: 'report-free-1',
      title: '德国 vs 日本 · 赛前分析',
      type: '赛前分析',
      price: 'FREE',
      summary: '日本中场回收速度将决定德国肋部渗透效率。',
    },
  ],
}

export const authorDiscussionPlaceholder = '讨论区将在下一阶段开放评论、点赞、举报与作者回复。'

export const authorTypeTagTone = {
  专家: 'expert',
  AI: 'ai',
  网友: 'user',
  平台: 'platform',
} as const

export const fallbackAuthorId = predictCards[0]?.id ? 'author-zhangwei' : 'author-zhangwei'
