'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppIcon, type AppIconName } from '@/components/common/AppIcon'

const tabs: Array<{ href: string; label: string; icon: AppIconName }> = [
  { href: '/live', label: '实时', icon: 'radio' },
  { href: '/schedule', label: '赛程', icon: 'calendar' },
  { href: '/predict', label: '预测', icon: 'trophy' },
  { href: '/me', label: '我的', icon: 'user' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/live') return pathname.startsWith('/live')
  if (href === '/predict') return pathname.startsWith('/predict') || pathname.startsWith('/authors')
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="bottom-tab" aria-label="底部导航">
      {tabs.map((tab) => {
        const active = isActive(pathname, tab.href)
        return (
          <Link key={tab.href} href={tab.href} className={`bottom-tab-item ${active ? 'bottom-tab-item-active' : ''}`}>
            <AppIcon name={tab.icon} className="text-[14px]" />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
