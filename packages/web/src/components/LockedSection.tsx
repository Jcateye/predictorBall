interface LockedSectionProps {
  title: string
  items: string[]
  unlocked: boolean
}

export function LockedSection({ title, items, unlocked }: LockedSectionProps) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {unlocked ? (
        <ul className="plain-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <div className="locked-mask">
          <p>🔒 解锁后可查看完整内容</p>
          <ul className="plain-list">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
