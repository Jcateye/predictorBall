import { Controller, Get, Headers, Query } from '@nestjs/common'
import type { ApiResponse, FeedItem, FeedQuery } from '@predictor-ball/shared'
import { successResponse } from '../common/api-response.util'
import { toLimit, toPage } from '../common/query.util'
import { DataStoreService } from '../core/data-store.service'
import { AuthService } from '../auth/auth.service'

type FeedQueryInput = Omit<FeedQuery, 'page' | 'limit'> & {
  page?: string
  limit?: string
}

@Controller('v1/feed')
export class FeedController {
  constructor(
    private readonly dataStoreService: DataStoreService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getFeed(
    @Query() query: FeedQueryInput,
    @Headers('authorization') authorization?: string,
  ): Promise<ApiResponse<{ items: FeedItem[]; userId?: string }>> {
    const userId = this.authService.resolveUserIdFromHeader(authorization)
    const result = await this.dataStoreService.listFeed({
      ...query,
      page: toPage(query.page),
      limit: toLimit(query.limit),
    })

    return successResponse(
      {
        items: result.items,
        userId,
      },
      {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    )
  }
}
