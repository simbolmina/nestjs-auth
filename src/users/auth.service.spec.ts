import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Describe a test suite for the AuthService
describe('AuthService', () => {
  // Declare variables for the AuthService and a fake UsersService
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  // Run this function before each test in the suite
  beforeEach(async () => {
    const users: User[] = []; // Create an array to store fake users

    // Create a fake UsersService with mocked 'find' and 'create' methods
    fakeUsersService = {
      // Mock the 'find' method to return users with a matching email from the 'users' array
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },

      // Mock the 'create' method to add a new user to the 'users' array and return it
      create: (email: string, password: string) => {
        const user = {
          id: '12345',
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // Create a test module with JwtModule and the necessary AuthService and UsersService providers
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.TOKEN_SECRET_KEY, // Provide the secret for JWT signing
          signOptions: { expiresIn: '90d' }, // Set JWT expiration time
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService, // Replace the real UsersService with the fake one for testing purposes
        },
      ],
    }).compile(); // Compile the test module, which resolves the dependencies and creates an instance

    // Get an instance of AuthService from the compiled test module
    service = module.get(AuthService);
  });

  // Test if an AuthService instance can be created
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  // Test if the AuthService creates a new user with a salted and hashed password
  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('user4@test.com', '123456');

    // Check that the password has been hashed and is not the original one
    expect(user.data.password).not.toEqual('123456');

    // Split the password into salt and hash
    const [salt, hash] = user.data.password.split('.');

    // Check that the salt and hash are defined
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  // Test if the AuthService throws an error when signing up with an email that is already in use
  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  // Test if the AuthService throws an error when signing in with an unused email

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('test@test.com', 'password');

    const user = await service.signin('test@test.com', 'password');
    expect(user).toBeDefined();
  });
});
