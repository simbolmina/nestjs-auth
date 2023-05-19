import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { NotFoundException } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { Response } from 'express';
import { AuthController } from './auth.controller';

describe('UsersController', () => {
  let usersController: UsersController;
  let authController: AuthController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findAll: () => {
        return Promise.resolve([
          { id: '1', email: 'test@test.com', password: 'test' } as User,
        ]);
      },
      findOneById: (id: string) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User);
      },
      findByEmail: (email: string) => {
        return Promise.resolve({
          id: '1',
          email,
          password: 'password',
        } as User);
      },
      remove: (id: string) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User);
      },
      updateCurrentUser: (id: string, attrs: Partial<User>) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
          ...attrs,
        } as User);
      },
      deactivate: (id: string) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
          active: false,
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
      controllers: [UsersController, AuthController],
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

    usersController = module.get<UsersController>(UsersController);
    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('findUser returns a single user with given id', async () => {
    const user = await usersController.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOneById = () => null;
    await expect(usersController.findUser('1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('findAllUsers returns all users', async () => {
    await expect(usersController.findAllUsers()).resolves.toEqual([
      { id: '1', email: 'test@test.com', password: 'test' } as User,
    ]);
  });

  it('findUsersByEmail returns a list of users with given email', async () => {
    const user = await usersController.findUserByEmail('test@test.com');
    //expect(users).toEqual(1);
    expect(user.email).toEqual('test@test.com');
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

    const { data, token } = await authController.signin(
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

  it('removeUser deactivates user and returns user', async () => {
    const user = await usersController.removeUser('1');
    expect(user).toBeDefined();
    expect(user.active).toEqual(false);
  });

  it('removeUser throws an error if user is not found', async () => {
    fakeUsersService.deactivate = () => Promise.reject(new NotFoundException());
    await expect(usersController.removeUser('nonexistent')).rejects.toThrow(
      NotFoundException,
    );
  });
});
