// import { Test } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { v4 as uuidv4 } from 'uuid';
// import { NotFoundException } from '@nestjs/common';

// describe('UsersService', () => {
//   let usersService: UsersService;
//   let fakeUserRepository: Partial<Repository<User>>;
//   const userArray: User[] = [];

//   beforeEach(() => {
//     userArray.length = 0;
//     jest.resetAllMocks();
//   });

//   beforeEach(async () => {
//     fakeUserRepository = {
//       create: jest.fn().mockImplementation((user) => {
//         user.id = uuidv4();
//         user.gender = 'other';
//         user.role = 'user';
//         return user;
//       }),

//       save: jest.fn().mockImplementation((user: User | User[]) => {
//         if (Array.isArray(user)) {
//           userArray.push(...user);
//         } else {
//           userArray.push(user);
//         }
//         return Promise.resolve(user);
//       }),

//       find: jest.fn().mockImplementation(() => {
//         return Promise.resolve(userArray);
//       }),

//       findOne: jest.fn().mockImplementation((options) => {
//         const foundUser = userArray.find(
//           (user) => user.id === options.where.id,
//         );
//         return Promise.resolve(foundUser);
//       }),

//       remove: jest.fn().mockImplementation((user: User) => {
//         const index = userArray.findIndex((u) => u.id === user.id);
//         if (index !== -1) {
//           const [removedUser] = userArray.splice(index, 1);
//           return Promise.resolve(removedUser);
//         }
//         return Promise.resolve(undefined);
//       }),

//       findOneBy: jest.fn().mockImplementation((options) => {
//         const keys = Object.keys(options);
//         const foundUser = userArray.find((user) => {
//           return keys.every((key) => user[key] === options[key]);
//         });
//         return Promise.resolve(foundUser);
//       }),
//       preload: jest.fn().mockImplementation((values) => {
//         const user = userArray.find((user) => user.id === values.id);
//         if (!user) {
//           return undefined;
//         }
//         return { ...user, ...values };
//       }),
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
//     expect(fakeUserRepository.create).toHaveBeenCalledWith(
//       expect.objectContaining({ email, password }),
//     );
//     expect(fakeUserRepository.save).toHaveBeenCalledWith(
//       expect.objectContaining({ email, password }),
//     );
//   });

//   it('should find all users', async () => {
//     const users = await usersService.findAll();
//     expect(users.length).toBe(userArray.length);
//   });

//   it('should find one user by id', async () => {
//     const email = 'test2@example.com';
//     const password = 'testpassword2';
//     const user = await usersService.create(email, password);
//     const foundUser = await usersService.findOneById(user.id);

//     expect(foundUser).toBeDefined();
//     expect(foundUser.email).toBe(email);
//     expect(fakeUserRepository.findOneBy).toHaveBeenCalledWith({
//       id: user.id,
//     });
//   });

//   it('should update a user', async () => {
//     const email = 'test3@example.com';
//     const password = 'testpassword3';
//     let user = await usersService.create(email, password);

//     const newGender = 'male';
//     const updatedUser = await usersService.updateCurrentUser(user.id, {
//       gender: newGender,
//     });

//     expect(updatedUser.gender).toBe(newGender);
//   });

//   it('should update a user by admin (additional fields)', async () => {
//     const email = 'test5@example.com';
//     const password = 'testpassword5';
//     let user = await usersService.create(email, password);

//     const newEmail = 'updated2@example.com';
//     const newRole = 'admin';
//     const newIsVIP = true;

//     const updatedUser = await usersService.updateUserByAdmin(user.id, {
//       email: newEmail,
//       role: newRole,
//       isVIP: newIsVIP,
//     });

//     // Check that the email, role and isVIP were updated
//     expect(updatedUser.email).toBe(newEmail);
//     expect(updatedUser.role).toBe(newRole);
//     expect(updatedUser.isVIP).toBe(newIsVIP);
//   });

//   it('should remove a user if it exists', async () => {
//     const email = 'test4@example.com';
//     const password = 'testpassword4';

//     const user = await usersService.create(email, password);
//     await usersService.remove(user.id);
//     expect(fakeUserRepository.remove).toHaveBeenCalled();
//     expect(await usersService.findOneById(user.id)).toBeUndefined();
//   });

//   it('should throw an error if a user does not exist', async () => {
//     const nonExistentUserId = 'non-existent-id';
//     await expect(usersService.remove(nonExistentUserId)).rejects.toThrow(
//       NotFoundException,
//     );
//     expect(fakeUserRepository.remove).not.toHaveBeenCalled();
//   });

//   it('should deactivate a user', async () => {
//     const email = 'test5@example.com';
//     const password = 'testpassword5';
//     const user = await usersService.create(email, password);
//     console.log(user);

//     const deactivatedUser = await usersService.deactivate(user.id);
//     expect(deactivatedUser).toBeDefined();
//   });
// });

// // fakeUserRepository = {
// //   create: jest.fn().mockImplementation((user) => {
// //     user.id = uuidv4();
// //     user.gender = 'other';
// //     user.role = 'user';
// //     return user;
// //   }),

// //   save: jest.fn().mockImplementation((user: User | User[]) => {
// //     if (Array.isArray(user)) {
// //       userArray.push(...user);
// //     } else {
// //       userArray.push(user);
// //     }
// //     return Promise.resolve(user);
// //   }),

// //   find: () => {
// //     return Promise.resolve(userArray);
// //   },
// //   findOne: (id) => {
// //     const foundUser = userArray.find((user) => user.id === id);
// //     return Promise.resolve(foundUser);
// //   },
// //   remove: jest.fn().mockImplementation((user: User) => {
// //     const index = userArray.findIndex((u) => u.id === user.id);
// //     if (index !== -1) {
// //       const [removedUser] = userArray.splice(index, 1);
// //       return Promise.resolve(removedUser);
// //     }
// //     return Promise.resolve(undefined);
// //   }),

// //   findOneBy: (options) => {
// //     const keys = Object.keys(options);
// //     const foundUser = userArray.find((user) => {
// //       return keys.every((key) => user[key] === options[key]);
// //     });
// //     return Promise.resolve(foundUser);
// //   },
// // };

// // describe('UsersService', () => {
// //   let usersService: UsersService;
// //   let fakeUserRepository: Partial<Repository<User>>;

// //   const userArray: User[] = [];

// //   beforeEach(async () => {
// //     fakeUserRepository = {
// //       create: (user) => {
// //         userArray.push(user);
// //         return user;
// //       },
// //       // save: (user: User) => {
// //       //   userArray.push(user);
// //       //   return Promise.resolve(user);
// //       // },
// //       find: () => {
// //         return Promise.resolve(userArray);
// //       },
// //       findOne: (options) => {
// //         const foundUser = userArray.find(user => user.id === options.where.id);
// //         return Promise.resolve(foundUser);
// //       },
// //       // remove: (user: User) => {
// //       //   const index = userArray.indexOf(user);
// //       //   if (index > -1) {
// //       //     userArray.splice(index, 1);
// //       //   }
// //       //   return Promise.resolve(user);
// //       // },
// //     };

// //     const module = await Test.createTestingModule({
// //       providers: [
// //         UsersService,
// //         {
// //           provide: getRepositoryToken(User),
// //           useValue: fakeUserRepository,
// //         },
// //       ],
// //     }).compile();

// //     usersService = module.get<UsersService>(UsersService);
// //   });
// // });
