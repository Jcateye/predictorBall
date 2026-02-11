import { EntitlementsPanel } from '@/components/EntitlementsPanel'
import { FollowsPanel } from '@/components/FollowsPanel'
import { RemindersPanel } from '@/components/RemindersPanel'

export default function MePage() {
  return (
    <div className="stack">
      <section className="panel">
        <h2 className="page-title">我的</h2>
        <p className="muted">已购回看、关注关系、后续会员能力将在这里持续扩展。</p>
      </section>
      <EntitlementsPanel />
      <FollowsPanel />
      <RemindersPanel />
    </div>
  )
}
