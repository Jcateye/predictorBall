import { createHmac } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { AuthUser } from '@predictor-ball/shared'
import { DataStoreService } from '../core/data-store.service'

@Injectable()
export class AuthService {
  private readonly secret: string

  constructor(
    configService: ConfigService,
    private readonly dataStoreService: DataStoreService,
  ) {
    this.secret = configService.get<string>('jwtSecret') ?? 'predictor-ball-dev-secret'
  }

  createMockToken(userId: string): string {
    const signature = this.sign(userId)
    return `mock.${userId}.${signature}`
  }

  resolveUserFromHeader(authorization?: string): AuthUser | undefined {
    if (!authorization?.startsWith('Bearer ')) {
      return undefined
    }

    const token = authorization.replace(/^Bearer\s+/i, '').trim()
    const userId = this.parseToken(token)
    if (!userId) {
      return undefined
    }

    return this.dataStoreService.getUserById(userId)
  }

  resolveUserIdFromHeader(authorization?: string): string | undefined {
    const user = this.resolveUserFromHeader(authorization)
    return user?.id
  }

  private parseToken(token: string): string | undefined {
    const [prefix, userId, signature] = token.split('.')

    if (prefix !== 'mock' || !userId || !signature) {
      return undefined
    }

    const expected = this.sign(userId)
    if (signature !== expected) {
      return undefined
    }

    return userId
  }

  private sign(input: string): string {
    return createHmac('sha256', this.secret).update(input).digest('hex').slice(0, 32)
  }
}
