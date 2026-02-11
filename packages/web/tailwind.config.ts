import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0D0D0D',
        'bg-card': '#1A1A1A',
        'bg-muted': '#2A2A2A',
        'accent-gold': '#C9A962',
        'accent-blue': '#42A5F5',
        'accent-green': '#4CAF50',
        'accent-red': '#E53935',
        'live-red': '#FF3B30',
        'text-primary': '#F5F4F2',
        'text-secondary': '#8A8A8A',
        'text-tertiary': '#7A7A7A',
        'text-muted': '#6A6A6A',
        'text-disabled': '#5A5A5A',
        'border-subtle': '#2A2A2A',
        'border-divider': '#5A5A5A',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'serif'],
        system: ['var(--font-system)', 'sans-serif'],
      },
      boxShadow: {
        none: 'none',
      },
      maxWidth: {
        screenMobile: '402px',
      },
    },
  },
  plugins: [],
}

export default config
