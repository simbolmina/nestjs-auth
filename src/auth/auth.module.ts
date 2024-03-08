import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';
import { ValidateLoginMiddleware } from './middlewares/validation.middleware';
import { CryptoService } from './crypto.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('TOKEN_SECRET_KEY'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RefreshTokenStrategy,
    PasswordService,
    TokenService,
    CryptoService,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateLoginMiddleware)
      .forRoutes({ path: 'auth/login', method: RequestMethod.POST });
  }
}
