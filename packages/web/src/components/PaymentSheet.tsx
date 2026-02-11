'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { getToken } from '@/lib/auth-storage'

interface OrderResponse {
  orderNo: string
  amount: number
}

interface PaymentSheetProps {
  reportId: string
  price: number
  onPaid: () => void
}

export function PaymentSheet({ reportId, price, onPaid }: PaymentSheetProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const unlock = async () => {
    const token = getToken()
    if (!token) {
      setError('请先在首页执行 Mock 登录')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const order = await apiClient<OrderResponse>('/orders', {
        method: 'POST',
        body: JSON.stringify({ reportId }),
        token,
      })

      await apiClient('/payments/mock-confirm', {
        method: 'POST',
        body: JSON.stringify({
          orderNo: order.orderNo,
          paymentEventId: `mock-event-${Date.now()}`,
        }),
        token,
      })

      onPaid()
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : '解锁失败，请稍后重试'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel payment-sheet">
      <p>解锁完整报告：¥{price.toFixed(1)}</p>
      <button type="button" className="btn" disabled={loading} onClick={unlock}>
        {loading ? '处理中...' : '模拟支付并解锁'}
      </button>
      {error ? <p className="status-error">{error}</p> : null}
    </div>
  )
}
