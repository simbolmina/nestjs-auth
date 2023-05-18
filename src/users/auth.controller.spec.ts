import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from './users.controller';
import { v4 as uuidv4 } from 'uuid';

describe('AuthController', () => {
  let authController: AuthController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  let fakeUserRepository: Partial<Repository<User>>;
  const userArray: User[] = [];

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
    fakeUserRepository = {
      create: jest.fn().mockImplementation((user) => {
        user.id = uuidv4();
        user.gender = 'other';
        user.role = 'user';
        return user;
      }),

      save: jest.fn().mockImplementation((user: User | User[]) => {
        if (Array.isArray(user)) {
          userArray.push(...user);
        } else {
          userArray.push(user);
        }
        return Promise.resolve(user);
      }),

      find: jest.fn().mockImplementation(() => {
        return Promise.resolve(userArray);
      }),

      findOne: jest.fn().mockImplementation((options) => {
        const foundUser = userArray.find(
          (user) => user.id === options.where.id,
        );
        return Promise.resolve(foundUser);
      }),

      remove: jest.fn().mockImplementation((user: User) => {
        const index = userArray.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          const [removedUser] = userArray.splice(index, 1);
          return Promise.resolve(removedUser);
        }
        return Promise.resolve(undefined);
      }),

      findOneBy: jest.fn().mockImplementation((options) => {
        const keys = Object.keys(options);
        const foundUser = userArray.find((user) => {
          return keys.every((key) => user[key] === options[key]);
        });
        return Promise.resolve(foundUser);
      }),
      preload: jest.fn().mockImplementation((values) => {
        const user = userArray.find((user) => user.id === values.id);
        if (!user) {
          return undefined;
        }
        return { ...user, ...values };
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('TOKEN_SECRET_KEY'),
            signOptions: { expiresIn: '90d' },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AuthController, UsersController],
      providers: [
        JwtStrategy,
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
        {
          provide: JwtService,
          useValue: new JwtService({ secret: 'test-secret' }),
        },
        {
          provide: getRepositoryToken(User),
          useValue: fakeUserRepository,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
