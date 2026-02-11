import { Controller, Get, Param } from '@nestjs/common'
import type {
  ApiResponse,
  LiveEventDto,
  LiveStatDto,
  MatchCard,
} from '@predictor-ball/shared'
import { successResponse } from '../common/api-response.util'
import { DataStoreService } from '../core/data-store.service'

interface LiveDetailResponse {
  match: MatchCard
  events: LiveEventDto[]
  stats?: LiveStatDto
  updatedAt: string
}

@Controller('v1/live')
export class LiveController {
  constructor(private readonly dataStoreService: DataStoreService) {}

  @Get()
  getLiveList(): ApiResponse<MatchCard[]> {
    return successResponse(this.dataStoreService.listLiveMatches())
  }

  @Get(':matchId')
  getLiveDetail(@Param('matchId') matchId: string): ApiResponse<LiveDetailResponse> {
    return successResponse(this.dataStoreService.getLiveDetail(matchId))
  }
}
