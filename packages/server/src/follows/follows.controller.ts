import { Controller, Param, Post, UseGuards } from '@nestjs/common'
import type { ApiResponse } from '@predictor-ball/shared'
import { CurrentUser } from '../auth/current-user.decorator'
import { MockAuthGuard } from '../auth/mock-auth.guard'
import { successResponse } from '../common/api-response.util'
import { DataStoreService } from '../core/data-store.service'

@Controller('v1/follows')
@UseGuards(MockAuthGuard)
export class FollowsController {
  constructor(private readonly dataStoreService: DataStoreService) {}

  @Post('authors/:authorId')
  async followAuthor(
    @CurrentUser() user: { id: string },
    @Param('authorId') authorId: string,
  ): Promise<ApiResponse<{ followed: boolean }>> {
    return successResponse(await this.dataStoreService.followAuthor(user.id, authorId))
  }

  @Post('teams/:teamId')
  async followTeam(
    @CurrentUser() user: { id: string },
    @Param('teamId') teamId: string,
  ): Promise<ApiResponse<{ followed: boolean }>> {
    return successResponse(await this.dataStoreService.followTeam(user.id, teamId))
  }

  @Post('matches/:matchId')
  async followMatch(
    @CurrentUser() user: { id: string },
    @Param('matchId') matchId: string,
  ): Promise<ApiResponse<{ followed: boolean }>> {
    return successResponse(await this.dataStoreService.followMatch(user.id, matchId))
  }
}
