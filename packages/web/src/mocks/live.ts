import type { LiveEventItem, LiveStatBarItem, MatchMeta } from '@/mocks/types'

export const liveFilters = ['全部', '热门', '英超', '西甲', '意甲', '我关注'] as const

export const liveLeagueSections: ReadonlyArray<{
  league: string
  matches: ReadonlyArray<MatchMeta>
}> = [
  {
    league: '英超',
    matches: [
      {
        id: 'live-fr-br',
        league: '世界杯',
        stage: '淘汰赛',
        kickOffLabel: '67\' LIVE',
        status: '下半场',
        statusTone: 'live',
        home: { name: '法国', score: 2 },
        away: { name: '巴西', score: 1 },
        statsLine: '黄牌 2:1 · 角球 5:4',
        hot: true,
        pro: true,
      },
      {
        id: 'live-de-jp',
        league: '世界杯',
        stage: '小组赛 C组',
        kickOffLabel: '22\' LIVE',
        status: '上半场',
        statusTone: 'live',
        home: { name: '德国', score: 0 },
        away: { name: '日本', score: 0 },
        statsLine: '黄牌 0:1 · 角球 2:2',
        pro: true,
      },
    ],
  },
]

export const upcomingSection: ReadonlyArray<MatchMeta> = [
  {
    id: 'live-ar-nl',
    league: '世界杯',
    stage: '淘汰赛',
    kickOffLabel: '明天 00:00',
    status: '即将开始',
    statusTone: 'upcoming',
    home: { name: '阿根廷' },
    away: { name: '荷兰' },
    statsLine: '赛前热度 89',
    hot: true,
  },
]

export const liveDetailById: Readonly<Record<string, {
  match: MatchMeta
  scoreLabel: string
  matchMeta: string
  events: ReadonlyArray<LiveEventItem>
  stats: ReadonlyArray<LiveStatBarItem>
  proInsight: {
    freeSummary: string
    lockedItems: ReadonlyArray<string>
    cta: string
  }
}>> = {
  'live-fr-br': {
    match: liveLeagueSections[0].matches[0],
    scoreLabel: '2 - 1',
    matchMeta: '67\' · 下半场',
    events: [
      {
        id: 'evt-1',
        minute: '63',
        type: '⚽',
        team: 'home',
        player: '姆巴佩',
        detail: '禁区内推射破门',
      },
      {
        id: 'evt-2',
        minute: '54',
        type: '🟨',
        team: 'away',
        player: '马尔基尼奥斯',
        detail: '战术犯规',
      },
      {
        id: 'evt-3',
        minute: '39',
        type: '⚽',
        team: 'away',
        player: '罗德里戈',
        detail: '反击扳平',
      },
    ],
    stats: [
      { label: '控球率', home: 56, away: 44, suffix: '%' },
      { label: '射门', home: 11, away: 8 },
      { label: '射正', home: 5, away: 3 },
      { label: '危险进攻', home: 34, away: 27 },
    ],
    proInsight: {
      freeSummary:
        '法国边路推进效率在 60 分钟后明显提升，但中卫回追速度下降，最后 20 分钟存在反击被打穿风险。',
      lockedItems: ['下半场走势判断', '关键风险点', '结论 + 置信度'],
      cta: '解锁赛中深度解读 · ¥9.9',
    },
  },
  'live-de-jp': {
    match: liveLeagueSections[0].matches[1],
    scoreLabel: '0 - 0',
    matchMeta: '22\' · 上半场',
    events: [
      {
        id: 'evt-4',
        minute: '18',
        type: '🟨',
        team: 'away',
        player: '远藤航',
        detail: '中场战术犯规',
      },
      {
        id: 'evt-5',
        minute: '11',
        type: '⚽',
        team: 'home',
        player: '哈弗茨',
        detail: '进球因越位被吹无效',
      },
    ],
    stats: [
      { label: '控球率', home: 61, away: 39, suffix: '%' },
      { label: '射门', home: 6, away: 3 },
      { label: '射正', home: 2, away: 1 },
      { label: '危险进攻', home: 21, away: 12 },
    ],
    proInsight: {
      freeSummary: '德国控球优势明显，但日本反击推进效率更高，比赛平衡尚未打破。',
      lockedItems: ['上半场节奏判断', '换人窗口风险', '半场结论 + 置信度'],
      cta: '解锁赛中深度解读 · ¥9.9',
    },
  },
  'sc-qa-ec': {
    match: {
      id: 'sc-qa-ec',
      league: '世界杯',
      stage: 'A组',
      kickOffLabel: '今天 21:00',
      status: '未开赛',
      statusTone: 'upcoming',
      home: { name: '卡塔尔', score: 0 },
      away: { name: '厄瓜多尔', score: 0 },
      statsLine: '赛前热度 73',
    },
    scoreLabel: '0 - 0',
    matchMeta: '赛前 · 阵容待公布',
    events: [
      {
        id: 'evt-6',
        minute: '-',
        type: 'ℹ️',
        team: 'neutral',
        player: '系统',
        detail: '比赛尚未开始，首发名单预计赛前 1 小时公布',
      },
    ],
    stats: [
      { label: '控球率', home: 50, away: 50, suffix: '%' },
      { label: '射门', home: 0, away: 0 },
      { label: '射正', home: 0, away: 0 },
      { label: '危险进攻', home: 0, away: 0 },
    ],
    proInsight: {
      freeSummary: '赛前窗口重点关注主队首发边路配置，可能影响开场节奏。',
      lockedItems: ['赛前形态判断', '关键变量雷达', '风险点 + 反转条件'],
      cta: '解锁赛前深度解读 · ¥9.9',
    },
  },
  'sc-nl-sn': {
    match: {
      id: 'sc-nl-sn',
      league: '世界杯',
      stage: 'A组',
      kickOffLabel: '今天 23:00',
      status: '未开赛',
      statusTone: 'upcoming',
      home: { name: '荷兰', score: 0 },
      away: { name: '塞内加尔', score: 0 },
      statsLine: '赛前热度 81',
    },
    scoreLabel: '0 - 0',
    matchMeta: '赛前 · 阵容待公布',
    events: [
      {
        id: 'evt-7',
        minute: '-',
        type: 'ℹ️',
        team: 'neutral',
        player: '系统',
        detail: '比赛尚未开始，等待赛前发布会信息更新',
      },
    ],
    stats: [
      { label: '控球率', home: 50, away: 50, suffix: '%' },
      { label: '射门', home: 0, away: 0 },
      { label: '射正', home: 0, away: 0 },
      { label: '危险进攻', home: 0, away: 0 },
    ],
    proInsight: {
      freeSummary: '双方中场拦截效率接近，先手进球价值非常高。',
      lockedItems: ['赛前形态判断', '关键变量雷达', '风险点 + 反转条件'],
      cta: '解锁赛前深度解读 · ¥9.9',
    },
  },
  'sc-ar-pl': {
    match: {
      id: 'sc-ar-pl',
      league: '世界杯',
      stage: 'C组',
      kickOffLabel: '明天 03:00',
      status: '未开赛',
      statusTone: 'upcoming',
      home: { name: '阿根廷', score: 0 },
      away: { name: '波兰', score: 0 },
      statsLine: '赛前热度 92',
    },
    scoreLabel: '0 - 0',
    matchMeta: '赛前 · 阵容待公布',
    events: [
      {
        id: 'evt-8',
        minute: '-',
        type: 'ℹ️',
        team: 'neutral',
        player: '系统',
        detail: '比赛尚未开始，预计明日凌晨更新临场信息',
      },
    ],
    stats: [
      { label: '控球率', home: 50, away: 50, suffix: '%' },
      { label: '射门', home: 0, away: 0 },
      { label: '射正', home: 0, away: 0 },
      { label: '危险进攻', home: 0, away: 0 },
    ],
    proInsight: {
      freeSummary: '阿根廷阵地战优势明显，但波兰定位球对抗不容忽视。',
      lockedItems: ['赛前形态判断', '关键变量雷达', '风险点 + 反转条件'],
      cta: '解锁赛前深度解读 · ¥9.9',
    },
  },
}
