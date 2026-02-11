import type { MatchMeta } from '@/mocks/types'

export const scheduleStageFilters = ['全部', '小组赛', '淘汰赛', '决赛'] as const
export const scheduleGroupFilters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const
export const scheduleDateTabs = ['昨天', '今天', '明天', '本周'] as const

export const scheduleSections: ReadonlyArray<{
  title: string
  matches: ReadonlyArray<MatchMeta>
}> = [
  {
    title: 'A组 · 小组赛第3轮',
    matches: [
      {
        id: 'sc-qa-ec',
        league: '世界杯',
        stage: 'A组',
        kickOffLabel: '今天 21:00',
        status: '未开赛',
        statusTone: 'default',
        home: { name: '卡塔尔' },
        away: { name: '厄瓜多尔' },
      },
      {
        id: 'sc-nl-sn',
        league: '世界杯',
        stage: 'A组',
        kickOffLabel: '今天 23:00',
        status: '未开赛',
        statusTone: 'default',
        home: { name: '荷兰' },
        away: { name: '塞内加尔' },
      },
    ],
  },
  {
    title: 'C组 · 小组赛第3轮',
    matches: [
      {
        id: 'sc-ar-pl',
        league: '世界杯',
        stage: 'C组',
        kickOffLabel: '明天 03:00',
        status: '未开赛',
        statusTone: 'default',
        home: { name: '阿根廷' },
        away: { name: '波兰' },
      },
    ],
  },
]
