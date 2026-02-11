import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import type { ApiResponse, HealthCheckResponse } from '@predictor-ball/shared'
import { successResponse } from './common/api-response.util'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): ApiResponse<HealthCheckResponse> {
    return successResponse(this.appService.getHealth())
  }
}
