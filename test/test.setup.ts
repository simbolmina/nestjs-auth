import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app.module';
import { TestDbConfig } from './test-db.config';

export const testSetup = async () => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
      TypeOrmModule.forRootAsync({
        name: 'test',
        useClass: TestDbConfig,
      }),
    ],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const connection = app.get(Connection);
  await connection.runMigrations(); // Run migrations to set up the test database

  return { app, connection };
};

export const testTeardown = async (connection: Connection) => {
  await connection.dropDatabase(); // Drop the test database
  await connection.close(); // Close the connection
};
