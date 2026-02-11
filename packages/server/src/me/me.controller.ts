import { Controller, Get, UseGuards } from '@nestjs/common'
import type {
  ApiResponse,
  EntitlementDto,
  FollowDto,
  ReminderDto,
} from '@predictor-ball/shared'
import { CurrentUser } from '../auth/current-user.decorator'
import { MockAuthGuard } from '../auth/mock-auth.guard'
import { successResponse } from '../common/api-response.util'
import { DataStoreService } from '../core/data-store.service'

@Controller('v1/me')
export class MeController {
  constructor(private readonly dataStoreService: DataStoreService) {}

  @Get('entitlements')
  @UseGuards(MockAuthGuard)
  async listEntitlements(
    @CurrentUser() user: { id: string },
  ): Promise<ApiResponse<EntitlementDto[]>> {
    return successResponse(await this.dataStoreService.listEntitlements(user.id))
  }

  @Get('follows')
  @UseGuards(MockAuthGuard)
  listFollows(@CurrentUser() user: { id: string }): ApiResponse<FollowDto[]> {
    return successResponse(this.dataStoreService.listFollows(user.id))
  }

  @Get('reminders')
  @UseGuards(MockAuthGuard)
  listReminders(@CurrentUser() user: { id: string }): ApiResponse<ReminderDto[]> {
    return successResponse(this.dataStoreService.listUpcomingReminders(user.id))
  }
}
