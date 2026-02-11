import { Controller, Get, Query } from '@nestjs/common'
import type { ApiResponse, MatchCard, MatchStatus } from '@predictor-ball/shared'
import { successResponse } from '../common/api-response.util'
import { toLimit, toPage } from '../common/query.util'
import { DataStoreService } from '../core/data-store.service'

interface ScheduleQuery {
  page?: string
  limit?: string
  status?: MatchStatus
  stage?: string
  groupCode?: string
  timeWindow?: 'today' | 'tomorrow' | 'this_week'
}

@Controller('v1/schedule')
export class ScheduleController {
  constructor(private readonly dataStoreService: DataStoreService) {}

  @Get()
  getSchedule(@Query() query: ScheduleQuery): ApiResponse<MatchCard[]> {
    const page = toPage(query.page)
    const limit = toLimit(query.limit)
    const result = this.dataStoreService.listSchedule({
      page,
      limit,
      status: query.status,
      stage: query.stage,
      groupCode: query.groupCode,
      timeWindow: query.timeWindow,
    })

    return successResponse(result.items, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    })
  }
}
