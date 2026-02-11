import Link from 'next/link'
import { StatusBar } from '@/components/sections/StatusBar'
import { scheduleDateTabs, scheduleGroupFilters, scheduleSections, scheduleStageFilters } from '@/mocks/schedule'

export default function SchedulePage() {
  return (
    <div>
      <StatusBar />
      <div className="screen-content">
        <header className="mb-4 flex items-end justify-between">
          <h1 className="screen-title">赛程</h1>
          <p className="nav-subtitle">世界杯 2026</p>
        </header>

        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {scheduleStageFilters.map((item, index) => (
            <button key={item} type="button" className={`chip whitespace-nowrap ${index === 0 ? 'chip-active' : ''}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
          {scheduleGroupFilters.map((group) => (
            <button key={group} type="button" className="border border-border-subtle bg-bg-muted px-3 py-1 text-[11px] uppercase tracking-[1px] text-text-secondary">
              {group}
            </button>
          ))}
        </div>

        <div className="mb-4 grid grid-cols-4">
          {scheduleDateTabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`border-b px-0 py-3 text-[12px] uppercase tracking-[1px] ${
                index === 1 ? 'border-accent-gold text-accent-gold' : 'border-border-subtle text-text-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <section className="space-y-4 pb-3">
          {scheduleSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <p className="text-[12px] uppercase tracking-[2px] text-accent-gold">{section.title}</p>
              {section.matches.map((match) => (
                <Link key={match.id} href={`/live/${match.id}`} className="block">
                  <article className="section-card border-l-4 p-4" style={{ borderLeftColor: 'var(--accent-gold)' }}>
                    <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[1px] text-text-secondary">
                      <span>{match.kickOffLabel}</span>
                      <span>{match.status}</span>
                    </div>
                    <p className="text-[15px] text-text-primary">
                      {match.home.name} VS {match.away.name}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
