import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
// import { getConnection } from 'typeorm';
// import { User } from '../src/users/entities/user.entity';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // beforeEach(async () => {
  //   // Get the connection and drop all tables
  //   const connection = getConnection();
  //   await connection.dropDatabase();

  //   // Or clear all entities from the database
  //   await connection.manager.clear(User);
  // });

  afterAll(async () => {
    await app.close();
  });

  it('handles a signup request', () => {
    const email = `test.email.${
      Math.floor(Math.random() * 9000) + 1000
    }@test.coom`;
    // return request(global.app.getHttpServer())
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201)
      .then((res) => {
        const { user, token } = res.body;
        // console.log(res.body);
        expect(user).toBeDefined();
        expect(token).toBeDefined();
        expect(user.id).toBeDefined();
        expect(user.email).toEqual(email);
      });
  });

  //re-check this one when it works
  it('signup as a new user then get the currently logged in user', async () => {
    const email = `test.email.${
      Math.floor(Math.random() * 9000) + 1000
    }@test.coom`;
    const res = request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201);

    const { token } = (await res).body;

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(email);
  });
});
