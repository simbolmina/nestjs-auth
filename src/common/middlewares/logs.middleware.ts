import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggingMiddleware.name);

  private maskSensitiveData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sensitiveFields = [
      'password',
      'authorization',
      'accessToken',
      'refreshToken',
      'tempAuthToken',
      'otp',
    ];
    const maskedData = { ...data };

    for (const field of sensitiveFields) {
      if (maskedData[field]) {
        maskedData[field] = '***';
      }
    }

    return maskedData;
  }

  private shouldLogResponse(req: Request): boolean {
    // Add your logic to decide which routes to log responses for
    // Example: Exclude logging for GET /api/v3/products
    const excludedRoutes = [
      { method: 'GET', path: '/api/v3/users/me' },
      // Add other routes as needed
    ];

    return !excludedRoutes.some(
      (route) =>
        route.method === req.method && req.originalUrl.startsWith(route.path),
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, body } = req;
    const start = Date.now();
    const requestId = uuidv4();

    // Add request ID to request object for tracing
    (req as any).requestId = requestId;

    // Mask sensitive fields in headers and body
    const maskedHeaders = this.maskSensitiveData({
      ...headers,
      authorization: headers.authorization ? '***' : undefined,
    });
    const maskedBody = this.maskSensitiveData(body);

    // Log incoming request details
    const clientIp =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    this.logger.log(
      `Request ID: ${requestId} - Incoming Request: ${method} ${originalUrl}`,
    );
    this.logger.debug(`Request ID: ${requestId} - Client IP: ${clientIp}`);
    this.logger.debug(
      `Request ID: ${requestId} - Headers: ${JSON.stringify(maskedHeaders)}`,
    );
    this.logger.debug(
      `Request ID: ${requestId} - Body: ${JSON.stringify(maskedBody)}`,
    );

    // Capture response data without causing circular reference issues
    const originalSend = res.send.bind(res);
    res.send = (body) => {
      const duration = Date.now() - start;
      const { statusCode } = res;

      if (this.shouldLogResponse(req)) {
        // Convert body to JSON if it's a string
        let responseBody;
        try {
          responseBody = typeof body === 'string' ? JSON.parse(body) : body;
        } catch (error) {
          responseBody = body;
        }

        // Mask sensitive fields in response body for logging
        const maskedResponseBody = this.maskSensitiveData(responseBody);

        // Log outgoing response with masked data asynchronously
        setImmediate(() => {
          this.logger.log(
            `Request ID: ${requestId} - Outgoing Response: ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
          );
          if (typeof maskedResponseBody === 'string') {
            this.logger.debug(
              `Request ID: ${requestId} - Response: ${maskedResponseBody}`,
            );
          } else {
            this.logger.debug(
              `Request ID: ${requestId} - Response: ${JSON.stringify(maskedResponseBody)}`,
            );
          }

          if (statusCode >= 400) {
            this.logger.error(
              `Request ID: ${requestId} - Error Response: ${method} ${originalUrl} ${statusCode}`,
            );
          }
        });
      }

      // Send original response body back to the client
      return originalSend(body);
    };

    next();
  }
}
