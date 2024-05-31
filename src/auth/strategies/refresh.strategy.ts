import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { TokenService } from '../token.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        const secret = configService.get<string>('REFRESH_TOKEN_SECRET');
        done(null, secret);
      },
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<any> {
    const refreshToken = req.headers.authorization?.split(' ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    return await this.tokenService.validateToken(refreshToken);
  }
}
