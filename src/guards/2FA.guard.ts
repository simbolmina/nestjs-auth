import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class TwoFactorAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { tempAuthToken } = request.body;

    if (!tempAuthToken) {
      throw new UnauthorizedException('Temporary token is required.');
    }

    try {
      const decoded = this.jwtService.verify(tempAuthToken);
      request.user = await this.validateUser(decoded.userId, context);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired temporary token.');
    }
  }

  async validateUser(userId: string, context: ExecutionContext): Promise<any> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('No user found for this ID.');
    }
    return user;
  }
}
