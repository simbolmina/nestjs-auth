import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserRoles } from './entities/user.entity';
import { SerializeInterceptor } from '../common/interceptors/serialize.interceptor';
import { NotFoundException } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { SortOrder } from 'src/common/enums';

describe('UsersController', () => {
  let usersController: UsersController;
  let userService: Partial<UsersService>;

  beforeEach(async () => {
    userService = {
      findAll: () => {
        return Promise.resolve({
          data: [{ id: '1', email: 'test@test.com', password: 'test' } as User],
          meta: {
            page: 1,
            pageSize: 10,
            totalItems: 1,
            totalPages: 1,
          },
        });
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
      remove: jest.fn((id: string) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User);
      }),
      updateCurrentUser: (id: string, attrs: Partial<User>) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
          ...attrs,
        } as User);
      },
      deactivate: jest.fn((id: string) => {
        return Promise.resolve();
      }),
      assignRole: jest.fn(() => Promise.resolve()),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: userService,
        },
        {
          provide: SerializeInterceptor,
          useValue: new SerializeInterceptor(UserDto),
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('findUser returns a single user with given id', async () => {
    const user = await usersController.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    userService.findOneById = () => null;
    await expect(usersController.findUser('1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('findAllUsers returns all users', async () => {
    await expect(
      usersController.findAllUsers({
        sortOrder: SortOrder.ASC,
        page: 1,
        limit: 10,
      }),
    ).resolves.toEqual({
      data: [{ id: '1', email: 'test@test.com', password: 'test' } as User],
      meta: {
        page: 1,
        pageSize: 10,
        totalItems: 1,
        totalPages: 1,
      },
    });
  });

  it('removeCurrentUser deactivates current user', async () => {
    await usersController.removeCurrentUser({ id: '1' });
    expect(userService.deactivate).toHaveBeenCalledWith('1');
  });

  it('deleteUser removes a user', async () => {
    const user = await usersController.deleteUser('1');
    expect(user).toBeDefined();
  });

  it('deleteUser throws an error if user is not found', async () => {
    userService.remove = () => Promise.reject(new NotFoundException());
    await expect(usersController.deleteUser('nonexistent')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('assignRole delegates to users service', async () => {
    await usersController.assignRole('1', UserRoles.Admin);
    expect(userService.assignRole).toHaveBeenCalledWith('1', UserRoles.Admin);
  });
});
