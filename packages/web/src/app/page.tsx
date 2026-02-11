import Link from 'next/link'
import type { HealthCheckResponse } from '@predictor-ball/shared'
import { publicApiClient } from '@/lib/api-client'

export default async function Home() {
  let health: HealthCheckResponse | null = null

  try {
    health = await publicApiClient<HealthCheckResponse>('/health')
  } catch {
    // Server might not be running
  }

  return (
    <div className="stack">
      <section className="panel">
        <h2 className="page-title">世界杯预测 MVP</h2>
        <p className="muted">Web First · Mock 数据 · 模拟支付闭环</p>
      </section>
      <section className="panel">
        <h3>服务状态</h3>
        {health ? (
          <p className="status-ok">后端可用：{health.status}</p>
        ) : (
          <p className="status-error">后端不可用，请先启动 server</p>
        )}
      </section>
      <section className="panel">
        <h3>快速入口</h3>
        <div className="row">
          <Link href="/schedule" className="text-link">
            去看赛程
          </Link>
          <Link href="/live" className="text-link">
            去看实况
          </Link>
          <Link href="/predict" className="text-link">
            去看预测广场
          </Link>
        </div>
      </section>
    </div>
  )
}
