import { Body, Controller, Post } from '@nestjs/common'
import type { ApiResponse, AuthUser } from '@predictor-ball/shared'
import { successResponse } from '../common/api-response.util'
import { DataStoreService } from '../core/data-store.service'
import { AuthService } from './auth.service'

interface MockLoginBody {
  nickname?: string
}

interface MockLoginResponse {
  token: string
  user: AuthUser
}

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly dataStoreService: DataStoreService,
    private readonly authService: AuthService,
  ) {}

  @Post('mock-login')
  async mockLogin(@Body() body: MockLoginBody): Promise<ApiResponse<MockLoginResponse>> {
    const user = await this.dataStoreService.createOrGetMockUser(body.nickname)
    const token = this.authService.createMockToken(user.id)

    return successResponse({
      token,
      user,
    })
  }
}
