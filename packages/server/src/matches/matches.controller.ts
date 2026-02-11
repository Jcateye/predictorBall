import { Controller, Get, Param } from '@nestjs/common'
import type { ApiResponse, MatchCard } from '@predictor-ball/shared'
import { successResponse } from '../common/api-response.util'
import { DataStoreService } from '../core/data-store.service'

@Controller('v1/matches')
export class MatchesController {
  constructor(private readonly dataStoreService: DataStoreService) {}

  @Get(':matchId')
  getMatch(@Param('matchId') matchId: string): ApiResponse<MatchCard> {
    return successResponse(this.dataStoreService.getMatch(matchId))
  }
}
