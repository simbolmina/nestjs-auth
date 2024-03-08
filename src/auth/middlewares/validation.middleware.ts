// Custom middleware in NestJS
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class ValidateLoginMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const errors = await validate(plainToInstance(LoginUserDto, req.body));
    if (errors.length > 0) {
      // Extract and format the error messages
      const formattedErrors = errors.map((error) => {
        // Combine all constraint messages for each property into a single string
        return Object.values(error.constraints).join(', ');
      });

      // Throw an exception with the formatted errors
      throw new BadRequestException(formattedErrors);
    } else {
      next();
    }
  }
}
