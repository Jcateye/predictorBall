const iconMap = {
  radio: '◉',
  calendar: '◫',
  trophy: '🏆',
  user: '◌',
  search: '⌕',
  'sliders-horizontal': '≡',
  'chevron-left': '‹',
  'chevron-right': '›',
  'share-2': '↗',
  settings: '⚙',
  globe: '◎',
  package: '▣',
  book: '▤',
  star: '✦',
  bell: '◔',
} as const

export type AppIconName = keyof typeof iconMap

export function AppIcon({ name, className = '' }: { name: AppIconName; className?: string }) {
  return <span className={className} aria-hidden="true">{iconMap[name]}</span>
}
