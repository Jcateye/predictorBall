import { Controller, Get, Post, Query } from '@nestjs/common'
import type { ApiResponse, InsightReportDto } from '@predictor-ball/shared'
import { successResponse } from '../common/api-response.util'
import { DataStoreService } from '../core/data-store.service'

@Controller('v1/insights')
export class InsightsController {
  constructor(private readonly dataStoreService: DataStoreService) {}

  @Get()
  getInsights(@Query('matchId') matchId?: string): ApiResponse<InsightReportDto[]> {
    return successResponse(this.dataStoreService.listInsights(matchId))
  }

  @Post('refresh')
  refreshInsights(): ApiResponse<InsightReportDto[]> {
    return successResponse(this.dataStoreService.refreshInsights())
  }
}
