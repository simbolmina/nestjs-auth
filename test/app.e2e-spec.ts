import dataSource, { closeDatabase, initializeDatabase } from '../db-config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('/info (GET)', (done) => {
    request(app.getHttpServer())
      .get('/info')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('version');
        expect(res.body).toHaveProperty('description');
        expect(res.body).toHaveProperty('web');
        expect(res.body).toHaveProperty('mobile');

        done();
      });
  });

  it('/health (GET)', (done) => {
    request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('info');
        expect(res.body).toHaveProperty('error');

        done();
      });
  });
});

// describe('AppController (e2e)', () => {
//   let app;

//   beforeEach(async () => {
//     // await dataSource.query('DROP TABLE IF EXISTS "brands" CASCADE');

//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   afterEach(async () => {
//     await dataSource.close();
//   });

//   // afterAll(async () => {
//   //   await global.teardown();
//   // });

//   it('/info (GET)', async () => {
//     return request(app.getHttpServer())
//       .get('/info')
//       .expect(200)
//       .then((response) => {
//         expect(response.body).toHaveProperty('message');
//         expect(response.body.message).toBe("This action returns app's info");
//       });
//   });

//   it('/health (GET)', async () => {
//     return request(app.getHttpServer())
//       .get('/health')
//       .expect(200)
//       .then((response) => {
//         expect(response.body).toHaveProperty('status');
//         expect(response.body.status).toBe('up');
//       });
//   });
// });
