import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountInactiveException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
