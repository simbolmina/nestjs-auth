import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let fakeUserRepository: Partial<Repository<User>>;

  const userArray: User[] = [];

  beforeEach(async () => {
    fakeUserRepository = {
      // create: (user : any) => {
      //   userArray.push(user);
      //   return user;
      // },
      // save: (user: User) => {
      //   userArray.push(user);
      //   return Promise.resolve(user);
      // },
      create: jest.fn().mockImplementation((user) => {
        user.id = uuidv4();
        user.gender = 'other';
        user.role = 'user';
        userArray.push(user);
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

      find: () => {
        return Promise.resolve(userArray);
      },
      findOne: (id) => {
        const foundUser = userArray.find((user) => user.id === id);
        return Promise.resolve(foundUser);
      },
      // remove: async (id) => {
      //   const index = userArray.findIndex((u) => u.id === id);
      //   if (index !== -1) {
      //     const [removedUser] = userArray.splice(index, 1);
      //     return Promise.resolve(removedUser);
      //   }
      //   return Promise.resolve(undefined);
      // },
      remove: jest.fn().mockImplementation((user: User) => {
        const index = userArray.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          const [removedUser] = userArray.splice(index, 1);
          return Promise.resolve(removedUser);
        }
        throw new Error('User not found');
      }),

      findOneBy: (options) => {
        const keys = Object.keys(options);
        const foundUser = userArray.find((user) => {
          return keys.every((key) => user[key] === options[key]);
        });
        return Promise.resolve(foundUser);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUserRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  // it('should be defined', () => {
  //   expect(usersService).toBeDefined();
  // });

  // it('should create a user', async () => {
  //   const email = 'test@example.com';
  //   const password = 'testpassword';
  //   const user = await usersService.create(email, password);

  //   expect(user.email).toBe(email);
  //   expect(user.password).toBe(password);
  // });

  // it('should find all users', async () => {
  //   const users = await usersService.findAll();
  //   expect(users.length).toBe(userArray.length);
  // });

  // it('should find one user by id', async () => {
  //   const email = 'test2@example.com';
  //   const password = 'testpassword2';
  //   const user = await usersService.create(email, password);
  //   const foundUser = await usersService.findOneById(user.id);

  //   expect(foundUser).toBeDefined();
  //   expect(foundUser.email).toBe(email);
  // });

  // it('should update a user', async () => {
  //   const email = 'test3@example.com';
  //   const password = 'testpassword3';
  //   let user = await usersService.create(email, password);

  //   const newGender = 'male';
  //   const updatedUser = await usersService.update(user.id, {
  //     gender: newGender,
  //   });

  //   expect(updatedUser.gender).toBe(newGender);
  // });

  it('should remove a user if it exists', async () => {
    const email = 'test4@example.com';
    const password = 'testpassword4';

    const user = await usersService.create(email, password);
    await usersService.remove(user.id);
    expect(fakeUserRepository.remove).toHaveBeenCalled();
    expect(await usersService.findOneById(user.id)).toBeUndefined();
  });

  // it('should throw an error if a user does not exist', async () => {
  //   const nonExistentUserId = 'non-existent-id';
  //   await expect(usersService.remove(nonExistentUserId)).rejects.toThrow(
  //     NotFoundException,
  //   );
  // });

  // it('should remove a user', async () => {
  //   const email = 'test4@example.com';
  //   const password = 'testpassword4';
  //   const user = await usersService.create(email, password);

  //   console.log('user', user);

  //   const removedUser = await usersService.remove(user.id);
  //   console.log('removed user', removedUser);
  //   expect(removedUser).toBeDefined();
  //   expect(removedUser.email).toBe(email);

  //   const foundUser = await usersService.findOneById(user.id);
  //   expect(foundUser).toBeUndefined(); // this is correct
  // });

  // it('should deactivate a user', async () => {
  //   const email = 'test5@example.com';
  //   const password = 'testpassword5';
  //   const user = await usersService.create(email, password);

  //   const deactivatedUser = await usersService.deactivate(user.id);
  //   expect(deactivatedUser).toBeDefined();
  // })
});

// describe('UsersService', () => {
//   let service: UsersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         AppModule, // Add AppModule here
//         TypeOrmModule.forFeature([User]),
//       ],
//       providers: [UsersService],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

////------------------////

// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';
// import { AppModule } from '../app.module'; // Import the AppModule

// describe('UsersService', () => {
//   let service: UsersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         AppModule, // Add AppModule here
//         TypeOrmModule.forFeature([User]),
//       ],
//       providers: [UsersService],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

// import { Test } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { NotFoundException } from '@nestjs/common';

// describe('UsersService', () => {
//   let usersService: UsersService;
//   let fakeUserRepository: Partial<Repository<User>>;

//   const userArray: User[] = [];

//   beforeEach(async () => {
//     fakeUserRepository = {
//       create: (user) => {
//         userArray.push(user);
//         return user;
//       },
//       // save: (user: User) => {
//       //   userArray.push(user);
//       //   return Promise.resolve(user);
//       // },
//       find: () => {
//         return Promise.resolve(userArray);
//       },
//       findOne: (options) => {
//         const foundUser = userArray.find(user => user.id === options.where.id);
//         return Promise.resolve(foundUser);
//       },
//       // remove: (user: User) => {
//       //   const index = userArray.indexOf(user);
//       //   if (index > -1) {
//       //     userArray.splice(index, 1);
//       //   }
//       //   return Promise.resolve(user);
//       // },
//     };

//     const module = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: getRepositoryToken(User),
//           useValue: fakeUserRepository,
//         },
//       ],
//     }).compile();

//     usersService = module.get<UsersService>(UsersService);
//   });

//   it('should be defined', () => {
//     expect(usersService).toBeDefined();
//   });

//   it('should create a user', async () => {
//     const email = 'test@example.com';
//     const password = 'testpassword';
//     const user = await usersService.create(email, password);

//     expect(user.email).toBe(email);
//     expect(user.password).toBe(password);
//   });

//   it('should find all users', async () => {
//     const users = await usersService.findAll();
//     expect(users.length).toBe(userArray.length);
//   });

//   it('should find one user by id', async () => {
//     const email = 'test2@example.com';
//     const password = 'testpassword2';
//     const user = await usersService.create(email, password);

//     const foundUser = await usersService.findOne(user.id);
//     expect(foundUser).toBeDefined();
//     expect(foundUser.email).toBe(email);
//   });

//   it('should update a user', async () => {
//     const email = 'test3@example.com';
//     const password = 'testpassword3';
//     const user = await usersService.create(email, password);

//     const newEmail = 'updatedtest@example.com';
//     const updatedUser = await usersService.update(user.id, { email: newEmail });

//     expect(updatedUser.email).toBe(newEmail);
//   });

//   it('should remove a user', async () => {
//     const email = 'test4@example.com';
//     const password = 'testpassword4';
//     const user = await usersService.create(email, password);

//     const removedUser = await usersService.remove(user.id);
//     expect(removedUser).toBeDefined();
//     expect(removedUser.email).toBe(email);

//     const foundUser = await usersService.findOne(user.id);
//     expect(foundUser).toBeUndefined();
//   });

//   it('should deactivate a user', async () => {
//     const email = 'test5@example.com';
//     const password = 'testpassword5';
//     const user = await usersService.create(email, password);

//     const deactivatedUser = await usersService.deactivate(user.id);
//     expect(deactivatedUser).toBeDefined();
//   })
// });
