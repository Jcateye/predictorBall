import type { Metadata } from 'next'
import { Bebas_Neue, Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { BottomTabBar } from '@/components/layout/BottomTabBar'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
})

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-body',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-system',
})

export const metadata: Metadata = {
  title: 'PredictorBall',
  description: 'PredictorBall UI Mock',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${bebasNeue.variable} ${cormorant.variable} ${inter.variable} bg-bg-primary text-text-primary`}>
        <div className="mobile-shell">
          <main>{children}</main>
          <BottomTabBar />
        </div>
      </body>
    </html>
  )
}
