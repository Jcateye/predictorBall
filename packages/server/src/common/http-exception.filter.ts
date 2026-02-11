import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import type { Response } from 'express'
import { errorResponse } from './api-response.util'

@Catch()
export class HttpExceptionToApiResponseFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const body = exception.getResponse()
      const message =
        typeof body === 'string'
          ? body
          : Array.isArray((body as { message?: string | string[] }).message)
            ? (body as { message: string[] }).message.join(', ')
            : (body as { message?: string }).message ?? exception.message

      response.status(status).json(errorResponse(message))
      return
    }

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse('Internal server error'))
  }
}
