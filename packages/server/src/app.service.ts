import { Injectable } from '@nestjs/common'
import type { HealthCheckResponse } from '@predictor-ball/shared'

@Injectable()
export class AppService {
  getHealth(): HealthCheckResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'predictor-ball-server',
    }
  }
}
