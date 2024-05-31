import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh') {
  handleRequest(err, user, info) {
    if (err || !user) {
      // Translate the message based on the current language
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
