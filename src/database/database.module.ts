import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { currentConfig } from '../../db-config';

@Module({
  imports: [TypeOrmModule.forRoot(currentConfig)],
})
export class DatabaseModule {}
