import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      ttl: 10000, // ttl in ms
      max: 1000,
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    ValidationModule,
    TerminusModule,
    AuthModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
