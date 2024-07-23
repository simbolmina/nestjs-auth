import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ValidationModule } from './common/validation/validation.module';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from './common/common.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RequestLoggingMiddleware } from './common/middlewares/logs.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { APP_RATE_LIMIT, APP_RATE_TTL } from './common/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      ttl: 60000, // ttl in ms
      max: 1000,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: APP_RATE_TTL,
        limit: APP_RATE_LIMIT,
      },
    ]),
    DatabaseModule,
    UsersModule,
    ValidationModule,
    TerminusModule,
    AuthModule,
    HttpModule,
    CommonModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
