// global.setup.ts
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import { testSetup, testTeardown } from './test.setup';

declare global {
  namespace NodeJS {
    interface Global {
      app: INestApplication;
      connection: Connection;
    }
  }
}

beforeEach(async () => {
  const testApp = await testSetup();
  global.app = testApp.app;
  global.connection = testApp.connection;
});

afterEach(async () => {
  await testTeardown(global.connection);
});
