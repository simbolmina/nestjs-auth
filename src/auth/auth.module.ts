import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { PasswordService } from './password.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('TOKEN_SECRET_KEY'),
        signOptions: { expiresIn: '90d' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    NotificationsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthService,
    JwtStrategy,
    ConfigService,
    PasswordService,
  ],
})
export class AuthModule {}
