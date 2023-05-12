import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { NotFoundException } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { Response } from 'express';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findAll: () => {
        return Promise.resolve([
          { id: '1', email: 'test@test.com', password: 'test' } as User,
        ]);
      },
      findOne: (id: string) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: '1', email, password: 'password' } as User,
        ]);
      },
      remove: (id: string) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User);
      },
      update: (id: string, attrs: Partial<User>) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
          ...attrs,
        } as User);
      },
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({
          data: {
            id: '1',
            email,
            password,
          } as User,
          token: 'token',
        });
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: SerializeInterceptor,
          useValue: new SerializeInterceptor(UserDto),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUser returns a single user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('findAllUsers returns all users', async () => {
    await expect(controller.findAllUsers()).resolves.toEqual([
      { id: '1', email: 'test@test.com', password: 'test' } as User,
    ]);
  });

  it('findUsersByEmail returns a list of users with given email', async () => {
    const users = await controller.findUsersByEmail('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  // it('signin returns user and token', async () => {
  //   const { data, token } = await controller.signin({
  //     email: 'test@test.com',
  //     password: 'test',
  //   });
  //   expect(data.id).toEqual('1');
  //   expect(token).toBeDefined();
  // });
  it('signin returns user and token', async () => {
    const mockResponse = {
      cookie: jest.fn(),
      status: function () {
        return this;
      },
      json: function () {},
    } as unknown as Response;

    const { data, token } = await controller.signin(
      { email: 'test@test.com', password: 'test' },
      mockResponse,
    );

    expect(data.id).toEqual('1');
    expect(token).toBeDefined();
    expect(mockResponse.cookie).toHaveBeenCalledWith('auth_token', token, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
  });
});
