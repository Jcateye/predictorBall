import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import type { ApiResponse, PaymentConfirmDto } from '@predictor-ball/shared'
import { CurrentUser } from '../auth/current-user.decorator'
import { MockAuthGuard } from '../auth/mock-auth.guard'
import { successResponse } from '../common/api-response.util'
import { DataStoreService } from '../core/data-store.service'

@Controller('v1/payments')
export class PaymentsController {
  constructor(private readonly dataStoreService: DataStoreService) {}

  @Post('mock-confirm')
  @UseGuards(MockAuthGuard)
  async mockConfirm(
    @CurrentUser() user: { id: string },
    @Body() body: PaymentConfirmDto,
  ): Promise<ApiResponse<unknown>> {
    return successResponse(await this.dataStoreService.confirmMockPayment(user.id, body))
  }
}
