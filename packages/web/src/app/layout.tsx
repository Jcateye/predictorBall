import type { Metadata } from 'next'
import Link from 'next/link'
import { Bebas_Neue, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { AuthPanel } from '@/components/AuthPanel'

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

export const metadata: Metadata = {
  title: 'PredictorBall',
  description: 'PredictorBall MVP Web First',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${bebasNeue.variable} ${cormorant.variable}`}>
        <header className="top-nav">
          <h1>PredictorBall MVP</h1>
          <nav>
            <Link href="/live">实况</Link>
            <Link href="/schedule">赛程</Link>
            <Link href="/predict">预测</Link>
            <Link href="/publish">发布</Link>
            <Link href="/me">我的</Link>
          </nav>
        </header>
        <main className="page-container">
          <AuthPanel />
          {children}
        </main>
      </body>
    </html>
  )
}
