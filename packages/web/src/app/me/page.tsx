import { StatusBar } from '@/components/sections/StatusBar'
import { meFollowedTeams, meMainMenus, meProfile, meSecondaryMenus } from '@/mocks/me'
import { AppIcon } from '@/components/common/AppIcon'
import { Avatar } from '@/components/common/Avatar'

export default function MePage() {
  return (
    <div>
      <StatusBar />
      <div className="screen-content space-y-4">
        <header className="flex items-end justify-between">
          <h1 className="screen-title">我的</h1>
          <AppIcon name="settings" className="text-text-secondary" />
        </header>

        <section className="section-card flex items-center gap-4 p-5">
          <Avatar name={meProfile.name} size={56} />
          <div>
            <p className="text-[16px] text-text-primary">{meProfile.name}</p>
            <p className="text-[12px] text-text-secondary">{meProfile.userId}</p>
          </div>
        </section>

        <section className="section-card border-accent-gold p-4">
          <p className="text-[13px] uppercase tracking-[2px] text-accent-gold">👑 PRO 会员</p>
          <p className="mt-1 text-[12px] text-text-secondary">{meProfile.membership}</p>
        </section>

        <section className="section-card divide-y divide-border-subtle">
          {meMainMenus.map((menu) => (
            <div key={menu.label} className="flex items-center justify-between px-4 py-3 text-[13px] text-text-primary">
              <span className="inline-flex items-center gap-1">
                <AppIcon name={menu.icon} className="text-[12px]" />
                {menu.label}
              </span>
              <AppIcon name="chevron-right" className="text-text-muted" />
            </div>
          ))}
        </section>

        <section className="section-card space-y-2 p-4">
          <p className="text-[13px] uppercase tracking-[2px] text-accent-gold">我关注的球队</p>
          <div className="flex gap-2">
            {meFollowedTeams.map((team) => (
              <span key={team} className="border border-border-subtle bg-bg-muted px-3 py-2 text-[12px] text-text-secondary">
                {team}
              </span>
            ))}
          </div>
        </section>

        <section className="section-card divide-y divide-border-subtle pb-3">
          {meSecondaryMenus.map((menu) => (
            <div key={menu} className="flex items-center justify-between px-4 py-3 text-[13px] text-text-secondary">
              <span>{menu}</span>
              <AppIcon name="chevron-right" className="text-text-muted" />
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
