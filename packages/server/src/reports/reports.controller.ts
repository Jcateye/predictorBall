import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import type { ApiResponse, PublishReportDto, ReportDetailDto } from '@predictor-ball/shared'
import type {
  AuthUser,
  CreateReportUpdateDto,
  ReportRecommendationsDto,
  ReportUpdateDto,
} from '@predictor-ball/shared'
import { successResponse } from '../common/api-response.util'
import { DataStoreService } from '../core/data-store.service'
import { AuthService } from '../auth/auth.service'
import { MockAuthGuard } from '../auth/mock-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'

@Controller('v1/reports')
export class ReportsController {
  constructor(
    private readonly dataStoreService: DataStoreService,
    private readonly authService: AuthService,
  ) {}

  @Get(':reportId')
  async getReportDetail(
    @Param('reportId') reportId: string,
    @Headers('authorization') authorization?: string,
  ): Promise<ApiResponse<ReportDetailDto>> {
    const userId = this.authService.resolveUserIdFromHeader(authorization)
    return successResponse(await this.dataStoreService.getReportDetail(reportId, userId))
  }

  @Get(':reportId/updates')
  getReportUpdates(@Param('reportId') reportId: string): ApiResponse<ReportUpdateDto[]> {
    return successResponse(this.dataStoreService.listReportUpdates(reportId))
  }

  @Get(':reportId/recommendations')
  async getRecommendations(
    @Param('reportId') reportId: string,
  ): Promise<ApiResponse<ReportRecommendationsDto>> {
    return successResponse(await this.dataStoreService.getReportRecommendations(reportId))
  }

  @Post(':reportId/updates')
  @UseGuards(MockAuthGuard)
  async createReportUpdate(
    @Param('reportId') reportId: string,
    @CurrentUser() user: AuthUser,
    @Body() body: CreateReportUpdateDto,
  ): Promise<ApiResponse<ReportUpdateDto>> {
    return successResponse(await this.dataStoreService.addReportUpdate(user, reportId, body))
  }

  @Post('publish')
  @UseGuards(MockAuthGuard)
  async publish(
    @CurrentUser() user: { id: string },
    @Body() body: PublishReportDto,
  ): Promise<ApiResponse<unknown>> {
    return successResponse(await this.dataStoreService.publishReport(user.id, body))
  }
}
