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
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    console.log('RefreshTokenStrategy validate method called');
    console.log('Headers:', req.headers);

    const authorizationHeader = req.get('authorization');
    console.log('Authorization Header:', authorizationHeader);

    if (!authorizationHeader) {
      console.log('No authorization header found');
      throw new UnauthorizedException('No authorization header found');
    }

    const refreshToken = authorizationHeader.replace('Bearer ', '').trim();
    console.log('Extracted Refresh Token:', refreshToken);

    // Since your token is not a standard JWT, the actual validation should be adjusted.
    // Just for debugging, let's log the attempt to validate this token.
    try {
      console.log('Attempting to validate the refresh token');
      const validatedToken =
        await this.tokenService.validateToken(refreshToken);
      console.log('Refresh token validated:', validatedToken);

      return { ...payload, refreshToken };
    } catch (error) {
      console.error('Error during refresh token validation:', error);
      throw new UnauthorizedException('Failed to validate refresh token');
    }
  }
}
