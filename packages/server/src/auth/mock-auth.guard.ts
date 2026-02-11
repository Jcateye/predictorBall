import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import type { AuthUser } from '@predictor-ball/shared'
import { AuthService } from './auth.service'

@Injectable()
export class MockAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string | undefined>; user?: AuthUser }>()
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header')
    }

    const user = this.authService.resolveUserFromHeader(authHeader)

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token')
    }

    request.user = user
    return true
  }
}
