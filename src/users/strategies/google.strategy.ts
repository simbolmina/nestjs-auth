// google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(profile);
    const { id, displayName, emails, picture, gender, birthday } = profile;
    const email = emails[0].value;

    const user = {
      email,
      displayName,
      picture,
      gender,
      birthday,
      provider: 'google',
      googleId: id,
    };

    if (!user) {
      throw new Error('User not found');
    }

    done(null, user);
  }
}

// const user = await this.usersService.createGoogleUser(
//   email,
//   displayName,
//   picture,
//   gender,
//   birthday,
//   provider: 'google',
//   googleId: id,

// );
