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
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
