import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import type { ApiResponse, CreateOrderDto } from '@predictor-ball/shared'
import { CurrentUser } from '../auth/current-user.decorator'
import { MockAuthGuard } from '../auth/mock-auth.guard'
import { successResponse } from '../common/api-response.util'
import { DataStoreService } from '../core/data-store.service'

@Controller('v1/orders')
export class OrdersController {
  constructor(private readonly dataStoreService: DataStoreService) {}

  @Post()
  @UseGuards(MockAuthGuard)
  async createOrder(
    @CurrentUser() user: { id: string },
    @Body() body: CreateOrderDto,
  ): Promise<ApiResponse<unknown>> {
    return successResponse(await this.dataStoreService.createOrder(user.id, body))
  }
}
