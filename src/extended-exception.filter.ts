import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { format } from 'date-fns';
import { Statuses } from './typing/enums/statuses.enum';

@Catch(HttpException)
export class ExtendedException implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const errorCode = exception.getStatus();
    const errorMessage = exception.getResponse();

    response.status(errorCode).json({
      timestamp: format(new Date(), 'dd/MM/yyyy - hh:mm:ss'),
      status: Statuses.FAIL,
      data: {
        errorMessage,
        path: request.url,
        method: request.method,
      },
      code: errorCode || 500,
    });
  }
}
