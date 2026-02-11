import type { PredictCard, SignalItem } from '@/mocks/types'

export const predictPrimaryFilters = ['全部', '专家', 'AI', '网友'] as const
export const predictSecondaryFilters = ['淘汰赛', '小组', '今天', '赛前', '全部', '推荐'] as const

export const networkSignals: ReadonlyArray<SignalItem> = [
  {
    id: 'sig-1',
    signal: '法国中卫瓦拉内训练缺席，出场存疑',
    impact: '防空能力下降 → 定位球风险显著上升',
    confidenceLabel: '中',
    confidenceDots: 2,
    evidence: '2条证据',
    watch: '首发名单确认后验证，若缺阵关注替补质量',
  },
  {
    id: 'sig-2',
    signal: '巴西改练5后卫体系，主帅赛前发布会确认',
    impact: '比赛节奏放慢 → 低比分概率上升',
    confidenceLabel: '高',
    confidenceDots: 3,
    evidence: '官方发布会',
    watch: '首发阵型确认是否真正落地5后卫',
  },
  {
    id: 'sig-3',
    signal: '场地大雨预警，草皮湿滑影响传控打法',
    impact: '短传渗透成功率下降 → 长传对抗增多',
    confidenceLabel: '低',
    confidenceDots: 1,
    evidence: '天气预报',
    watch: '赛前2小时天气更新，是否转晴',
  },
]

export const networkLockedItems = [
  '比赛形态判断 + 置信度',
  '关键变量雷达（阵容/体能/战术/定位球/天气/心理）',
  '情景推演（A首发 vs A缺阵）',
  '风险点 + 反转条件',
] as const

export const predictCards: ReadonlyArray<PredictCard> = [
  {
    id: 'report-fr-br-expert',
    type: 'expert',
    authorName: '张伟 · 足球研究室',
    badgeText: '专家',
    hitRateText: '71% (10/14)',
    matchText: '⚔ 法国 vs 巴西 · 淘汰赛 · 明天 03:00',
    summaries: ['法国左路压迫成功率高于巴西右路出球稳定性。', '巴西若五后卫落位成功，比赛总进球上限被压低。', '前20分钟节奏将决定后续风险偏向。'],
    lockedItems: ['比赛结论 + 置信度', '关键变量（阵容/体能/战术对位/定位球）', '风险点（什么情况会反转）'],
    ctaText: '解锁 ¥9.9',
    ctaSubText: '128人已解锁',
    isFree: false,
    priceText: '¥9.9',
  },
  {
    id: 'report-de-jp-ai',
    type: 'ai',
    authorName: 'PredictorBall AI',
    badgeText: 'AI',
    hitRateText: '66% (18/27)',
    matchText: '⚔ 德国 vs 日本 · 小组赛C组 · 今天 21:00',
    summaries: ['日本中路回防速度优于德国边路切入速度。', '德国控球率预计高，但有效机会未必更多。'],
    lockedItems: [],
    ctaText: '免费查看',
    ctaSubText: '每日免费样例',
    isFree: true,
  },
  {
    id: 'report-ar-nl-user',
    type: 'user',
    authorName: '球迷老王',
    badgeText: '网友',
    hitRateText: '58% (7/12)',
    matchText: '⚔ 阿根廷 vs 荷兰 · 淘汰赛 · 后天 00:00',
    summaries: ['阿根廷边路推进强，但荷兰高点争顶优势明显。'],
    lockedItems: [],
    ctaText: '免费查看',
    ctaSubText: '网友免费分享',
    isFree: true,
  },
]

export const reportDetailById: Readonly<Record<string, {
  title: string
  subtitle: string
  updateTag: string
  author: {
    id: string
    name: string
    type: 'platform' | 'expert' | 'ai' | 'user'
    hitRate: string
  }
  updateLog: ReadonlyArray<{ time: string; content: string; latest?: boolean }>
  toc: ReadonlyArray<{ label: string; locked: boolean }>
  freeReasons: ReadonlyArray<string>
  lockedPreview: ReadonlyArray<string>
  unlockText: string
  moreFromAuthor: ReadonlyArray<{ id: string; title: string; price: string }>
}>> = {
  'report-fr-br-expert': {
    title: '阿森纳 VS 切尔西',
    subtitle: '英超 · 第28轮 · 今晚 19:30',
    updateTag: '报告更新于 18:45 · 含临场变量',
    author: {
      id: 'author-zhangwei',
      name: '张伟 · 足球研究室',
      type: 'expert',
      hitRate: '71% (14/17)',
    },
    updateLog: [
      { time: '18:45', content: '首发确认：法国换阵4-3-3，格列兹曼首发', latest: true },
      { time: '16:30', content: '阵型变化：巴西改打5后卫，加强防守' },
      { time: '14:00', content: '初始报告发布' },
    ],
    toc: [
      { label: '一眼看懂理由（3条核心逻辑）', locked: false },
      { label: '比赛结论 + 置信度', locked: true },
      { label: '关键变量（阵容/体能/战术对位/定位球）', locked: true },
      { label: '风险点（什么情况会反转）', locked: true },
    ],
    freeReasons: [
      '法国边路压迫强度在 60 分钟后仍能维持。',
      '巴西若提前落后，后场转移将更冒险。',
      '定位球将是最容易改写走势的变量。',
    ],
    lockedPreview: ['比赛结论 + 置信度', '关键变量雷达', '风险点与反转条件'],
    unlockText: '解锁完整报告 · ¥9.9',
    moreFromAuthor: [
      { id: 'more-1', title: '英格兰 vs 西班牙', price: '¥19.9' },
      { id: 'more-2', title: '德国 vs 日本', price: 'FREE' },
    ],
  },
  'report-de-jp-ai': {
    title: '德国 VS 日本',
    subtitle: '世界杯 · C组 · 今天 21:00',
    updateTag: 'AI 模型更新于 20:15 · 含阵容变量',
    author: {
      id: 'author-ai-core',
      name: 'PredictorBall AI',
      type: 'ai',
      hitRate: '66% (18/27)',
    },
    updateLog: [
      { time: '20:15', content: '模型已纳入最新首发与天气数据', latest: true },
      { time: '19:50', content: '日本中路回防速度指标上调' },
      { time: '18:30', content: '初始报告发布' },
    ],
    toc: [
      { label: '一眼看懂理由（2条核心逻辑）', locked: false },
      { label: '比赛结论 + 置信度', locked: false },
      { label: '关键变量（阵容/节奏/反击效率）', locked: false },
    ],
    freeReasons: [
      '德国控球率预计占优，但有效机会未必同步提升。',
      '日本反击直塞成功率在近5场明显提高。',
    ],
    lockedPreview: ['本报告为免费样例，已解锁完整内容'],
    unlockText: '免费查看完整报告',
    moreFromAuthor: [
      { id: 'report-fr-br-expert', title: '法国 vs 巴西', price: '¥9.9' },
      { id: 'report-ar-nl-user', title: '阿根廷 vs 荷兰', price: 'FREE' },
    ],
  },
  'report-ar-nl-user': {
    title: '阿根廷 VS 荷兰',
    subtitle: '世界杯 · 淘汰赛 · 后天 00:00',
    updateTag: '网友观点更新于 17:20',
    author: {
      id: 'author-user-laowang',
      name: '球迷老王',
      type: 'user',
      hitRate: '58% (7/12)',
    },
    updateLog: [
      { time: '17:20', content: '补充了双方定位球对抗样本', latest: true },
      { time: '16:05', content: '初始观点发布' },
    ],
    toc: [
      { label: '一眼看懂理由（1条核心逻辑）', locked: false },
      { label: '比赛结论 + 置信度', locked: false },
    ],
    freeReasons: ['阿根廷边路推进有优势，但荷兰高点争顶可能抵消该优势。'],
    lockedPreview: ['本报告为网友免费分享，无付费区'],
    unlockText: '免费查看完整报告',
    moreFromAuthor: [
      { id: 'report-de-jp-ai', title: '德国 vs 日本', price: 'FREE' },
      { id: 'report-fr-br-expert', title: '法国 vs 巴西', price: '¥9.9' },
    ],
  },
}
