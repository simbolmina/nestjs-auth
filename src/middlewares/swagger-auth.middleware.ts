import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SwaggerAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authToken = req.query.authToken;
    const password = 'Docs-123456';
    // const password = process.env.SWAGGER_PASSWORD;

    if (authToken && password && authToken === password) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  }
}
