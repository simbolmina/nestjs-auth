import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { TokenService } from '../token.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      // secretOrKey: 'some_secret_key',
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const authorizationHeader = req.get('authorization');

    if (!authorizationHeader) {
      console.log('No authorization header found');
      throw new UnauthorizedException('No authorization header found');
    }

    const refreshToken = authorizationHeader.replace('Bearer ', '').trim();

    await this.tokenService.validateToken(refreshToken);

    return { ...payload, refreshToken };
  }
}
