import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface ExceptionResponse {
  statusCode: number;
  message: string[] | string;
  error: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string | string[] = exception.message;
    let error: string = 'Internal Server Error';

    // if exception is an HttpException, then get the response
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as ExceptionResponse;
      if (exceptionResponse.message) {
        message = exceptionResponse.message;
      }
      if (exceptionResponse.error) {
        error = exceptionResponse.error;
      }
    }

    if (typeof message === 'string') {
      message = [message];
    }

    const errorResponse = {
      statusCode: status,
      message: message,
      error: error,
    };

    response.status(status).json(errorResponse);
  }
}
