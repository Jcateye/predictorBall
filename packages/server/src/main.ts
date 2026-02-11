import { createServer } from 'node:net'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { HttpExceptionToApiResponseFilter } from './common/http-exception.filter'

async function canBindPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer()

    server.once('error', () => resolve(false))
    server.once('listening', () => {
      server.close(() => resolve(true))
    })
    server.listen(port)
  })
}

async function resolvePort(preferredPort: number, maxAttempts = 10): Promise<number> {
  for (let offset = 0; offset <= maxAttempts; offset += 1) {
    const candidate = preferredPort + offset
    if (await canBindPort(candidate)) {
      return candidate
    }
  }
  throw new Error(`Unable to find free port starting from ${preferredPort}`)
}

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.setGlobalPrefix('api')
  app.enableCors({
    origin: configService.get<string>('corsOrigin'),
    credentials: true,
  })
  app.useGlobalFilters(new HttpExceptionToApiResponseFilter())

  const preferredPort = configService.get<number>('port') ?? 3001
  const isProduction = process.env.NODE_ENV === 'production'
  const port = isProduction ? preferredPort : await resolvePort(preferredPort)

  if (port !== preferredPort) {
    logger.warn(`Port ${preferredPort} in use, fallback to ${port}`)
  }

  await app.listen(port)
}

bootstrap()
