import Link from 'next/link'
import { StatusBar } from '@/components/sections/StatusBar'
import { liveFilters, liveLeagueSections, upcomingSection } from '@/mocks/live'

export default function LivePage() {
  return (
    <div>
      <StatusBar />
      <div className="screen-content">
        <header className="mb-4 flex items-end justify-between">
          <h1 className="screen-title">LIVE</h1>
          <span className="text-[11px] uppercase tracking-[2px] text-accent-gold">2 场进行中</span>
        </header>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {liveFilters.map((filter, index) => (
            <button key={filter} type="button" className={`chip whitespace-nowrap ${index === 0 ? 'chip-active' : ''}`}>
              {filter}
            </button>
          ))}
        </div>

        <section className="space-y-4">
          {liveLeagueSections.map((section) => (
            <div key={section.league} className="space-y-2">
              <p className="text-[12px] uppercase tracking-[2px] text-accent-gold">{section.league}</p>
              {section.matches.map((match) => (
                <Link key={match.id} href={`/live/${match.id}`} className="block">
                  <article className="section-card border-l-4 p-4" style={{ borderLeftColor: 'var(--live-red)' }}>
                    <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[1px] text-text-secondary">
                      <span>{match.kickOffLabel}</span>
                      <div className="flex items-center gap-2">
                        {match.hot ? <span className="border border-accent-red px-1 text-accent-red">HOT</span> : null}
                        {match.pro ? <span className="border border-accent-gold px-1 text-accent-gold">PRO</span> : null}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[16px] text-text-primary">{match.home.name}</p>
                        <p className="text-[16px] text-text-primary">{match.away.name}</p>
                      </div>
                      <div className="text-right font-heading text-[28px] leading-none text-text-primary">
                        <p>{match.home.score}</p>
                        <p>{match.away.score}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] text-text-muted">{match.statsLine}</p>
                  </article>
                </Link>
              ))}
            </div>
          ))}
        </section>

        <section className="mt-5 space-y-2">
          <p className="text-[12px] uppercase tracking-[2px] text-text-secondary">即将开始</p>
          {upcomingSection.map((match) => (
            <article key={match.id} className="section-card border-l-4 p-4" style={{ borderLeftColor: 'var(--accent-gold)' }}>
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[1px] text-text-secondary">
                <span>{match.kickOffLabel}</span>
                {match.hot ? <span className="border border-accent-red px-1 text-accent-red">HOT</span> : null}
              </div>
              <p className="text-[15px] text-text-primary">
                {match.home.name} VS {match.away.name}
              </p>
              <p className="mt-1 text-[11px] text-text-muted">{match.stage} · {match.statsLine}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
