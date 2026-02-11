import { Controller, Get, Param, Query } from '@nestjs/common'
import type { ApiResponse, AuthorProfileDto, FeedItem } from '@predictor-ball/shared'
import { successResponse } from '../common/api-response.util'
import { toLimit, toPage } from '../common/query.util'
import { DataStoreService } from '../core/data-store.service'

@Controller('v1/authors')
export class AuthorsController {
  constructor(private readonly dataStoreService: DataStoreService) {}

  @Get(':authorId')
  getAuthor(@Param('authorId') authorId: string): ApiResponse<AuthorProfileDto> {
    return successResponse(this.dataStoreService.getAuthorProfile(authorId))
  }

  @Get(':authorId/reports')
  async getAuthorReports(
    @Param('authorId') authorId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<ApiResponse<FeedItem[]>> {
    const result = await this.dataStoreService.getAuthorReports(
      authorId,
      toPage(page),
      toLimit(limit),
    )

    return successResponse(result.items, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    })
  }
}
