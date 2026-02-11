import Link from 'next/link'
import { StatusBar } from '@/components/sections/StatusBar'
import { TypeBadge } from '@/components/common/TypeBadge'
import { CtaButton } from '@/components/common/CtaButton'
import { AppIcon } from '@/components/common/AppIcon'
import { Avatar } from '@/components/common/Avatar'
import {
  networkLockedItems,
  networkSignals,
  predictCards,
  predictPrimaryFilters,
  predictSecondaryFilters,
} from '@/mocks/predict'

function confidenceDots(count: 1 | 2 | 3) {
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3].map((index) => (
        <span
          key={index}
          className={`h-1.5 w-1.5 rounded-full border border-accent-gold ${index <= count ? 'bg-accent-gold' : 'bg-bg-muted'}`}
        />
      ))}
    </span>
  )
}

export default function PredictPage() {
  return (
    <div>
      <StatusBar />
      <div className="screen-content space-y-4">
        <header className="flex items-end justify-between">
          <h1 className="screen-title">预测广场</h1>
          <AppIcon name="search" className="text-text-secondary" />
        </header>

        <div className="section-card flex items-center gap-2 px-4 py-3 text-[12px] text-text-muted">
          <AppIcon name="search" className="text-[12px]" />
          <span>搜索球队 / 比赛 / 作者</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {predictPrimaryFilters.map((filter, index) => (
            <button key={filter} type="button" className={`chip whitespace-nowrap ${index === 0 ? 'chip-active' : ''}`}>
              {filter}
            </button>
          ))}
          <button type="button" className="chip inline-flex items-center gap-1 px-3" aria-label="筛选">
            <AppIcon name="sliders-horizontal" className="text-[11px]" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {predictSecondaryFilters.map((filter) => (
            <button key={filter} type="button" className="border border-border-subtle bg-bg-muted px-3 py-1.5 text-[11px] uppercase tracking-[1px] text-text-secondary">
              {filter}
            </button>
          ))}
        </div>

        <section className="section-card space-y-3 border-2 border-accent-gold p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 border border-accent-gold bg-accent-gold px-2 py-1 text-[11px] uppercase tracking-[1px] text-bg-primary">
                <AppIcon name="globe" className="text-[10px]" />
                NETWORK INSIGHT
              </span>
            </div>
            <h2 className="text-[16px] tracking-[1px] text-text-primary">全网分析</h2>
          </div>
          <p className="text-[13px] text-text-secondary">⚔ 法国 vs 巴西 · 淘汰赛 · 明天 03:00</p>
          <div className="divider" />

          <div className="space-y-2">
            <p className="text-[12px] uppercase tracking-[2px] text-accent-gold">⚡ 增量信号</p>
            {networkSignals.map((signal, index) => (
              <article key={signal.id} className="border border-border-subtle bg-bg-muted p-3">
                <p className="text-[12px] text-text-primary">{index + 1}. {signal.signal}</p>
                <p className="mt-1 text-[12px] text-text-secondary">影响：{signal.impact}</p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-text-secondary">
                  <span>置信度：</span>
                  {confidenceDots(signal.confidenceDots)}
                  <span>{signal.confidenceLabel}（{signal.evidence}）</span>
                </div>
                <p className="mt-1 text-[11px] text-text-muted">观察：{signal.watch}</p>
              </article>
            ))}
          </div>

          <div className="divider" />
          <div className="space-y-1 text-[12px] text-text-muted">
            {networkLockedItems.map((item) => (
              <p key={item}>🔒 {item}</p>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <CtaButton className="flex-1">查看完整报告</CtaButton>
            <span className="text-[11px] text-text-secondary">18:45 更新</span>
          </div>
          <p className="text-[11px] text-text-muted">综合 12 条信源 · 官方 4 / 记者 5 / 数据 3</p>
        </section>

        <section className="space-y-3 pb-3">
          {predictCards.map((card) => (
            <article
              key={card.id}
              className={`section-card space-y-3 p-4 ${card.isFree ? 'border-accent-green' : 'border-border-subtle'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={card.authorName} />
                  <p className="text-[13px] text-text-primary">{card.authorName}</p>
                  <TypeBadge type={card.type} text={card.badgeText} />
                </div>
                <span className="text-[11px] text-text-secondary">{card.hitRateText}</span>
              </div>

              <p className="text-[13px] text-text-secondary">{card.matchText}</p>
              <div className="divider" />
              <div className="space-y-1 text-[12px] text-text-secondary">
                {card.summaries.map((summary) => (
                  <p key={summary}>• {summary}</p>
                ))}
              </div>

              {card.lockedItems.length > 0 ? (
                <>
                  <div className="divider" />
                  <div className="space-y-1 text-[12px] text-text-muted">
                    {card.lockedItems.map((item) => (
                      <p key={item}>🔒 {item}</p>
                    ))}
                  </div>
                </>
              ) : null}

              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/predict/reports/${card.id}`}
                  className={`flex-1 border px-3 py-2 text-center text-[12px] uppercase tracking-[1px] ${
                    card.isFree
                      ? 'border-accent-green bg-accent-green text-bg-primary'
                      : 'border-accent-gold bg-accent-gold text-bg-primary'
                  }`}
                >
                  {card.ctaText}
                </Link>
                <span className="text-[11px] text-text-muted">{card.ctaSubText}</span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
