import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dtos/update-user.dto';

const mockVerifyIdToken = jest.fn();

jest.mock('google-auth-library', () => {
  const mockVerifyIdToken = jest.fn();
  return {
    OAuth2Client: jest.fn(() => ({
      verifyIdToken: mockVerifyIdToken,
    })),
    mockVerifyIdToken, // Expose mockVerifyIdToken so that it can be accessed outside the mock factory
  };
});

// Describe a test suite for the AuthService
describe('AuthService', () => {
  // Declare variables for the AuthService and a fake UsersService
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  let users: User[] = [];

  // Run this function before each test in the suite
  beforeEach(async () => {
    users = []; // Create an array to store fake users

    // Create a fake UsersService with mocked 'find' and 'create' methods
    fakeUsersService = {
      // Mock the 'find' method to return users with a matching email from the 'users' array
      findOneById: (id: string) => {
        const user = users.find((user) => user.id === id);
        return Promise.resolve(user);
      },
      findByEmail: (email: string) => {
        const user = users.find((user) => user.email === email);
        return Promise.resolve(user);
      },

      // Mock the 'findByGoogleId' method to return users with a matching Google ID from the 'users' array
      findByGoogleId: (googleId: string) => {
        const user = users.find((user) => user.googleId === googleId);
        return Promise.resolve(user);
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

      // Mock the 'createFromGoogle' method to create a new user from Google login
      createFromGoogle: (payload: any) => {
        const user = {
          id: '12345',
          email: payload.email,
          googleId: payload.sub,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      update: (id: string, attrs: Partial<User>) => {
        let user = fakeUsersService.findOneById(id);
        if (!user) {
          throw new NotFoundException('user not found');
        }
        user = { ...user, ...attrs };
        return Promise.resolve(user);
      },
    };

    // Create a test module with JwtModule and the necessary AuthService and UsersService providers
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            //secret: 'secret_key_test',
            secret: configService.get('TOKEN_SECRET_KEY'),
            //secret: process.env.TOKEN_SECRET_KEY,
            signOptions: { expiresIn: '90d' },
          }),
          inject: [ConfigService],
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

  it('can handle Google login', async () => {
    const token = 'fakeGoogleToken';
    const payload = {
      sub: '12345',
      email: 'test@gmail.com',
      picture: 'http://example.com/image.jpg',
      displayName: 'Test User',
      given_name: 'Test',
      family_name: 'User',
      email_verified: true,
    };

    require('google-auth-library').mockVerifyIdToken.mockResolvedValueOnce({
      getPayload: () => payload,
    });

    const response = await service.googleLogin(token);

    expect(response).toBeDefined();
    expect(response.data.id).toEqual(payload.sub);
    expect(response.data.email).toEqual(payload.email);
  });

  it('changes the password and allows the user to sign in with the new password', async () => {
    const userId = '12345';
    const changePasswordDto = new ChangePasswordDto();
    changePasswordDto.oldPassword = 'oldPassword';
    changePasswordDto.newPassword = 'newPassword';

    // Create a user before changing the password
    await service.signup('user@test.com', 'oldPassword');

    const result = await service.changePassword(userId, changePasswordDto);

    // Verify that the message is correct
    expect(result.message).toEqual('Password successfully updated');

    // Verify that the user is able to sign in with the new password
    const user = await service.signin('user@test.com', 'newPassword');
    expect(user).toBeDefined();

    // Verify that the findOneById method was called on the UsersService instance
    //expect(fakeUsersService.findOneById).toHaveBeenCalledWith(userId);
  });

  // Test if the AuthService throws an error when changing password with an incorrect old password
  it('throws an error if old password is incorrect when changing password', async () => {
    const userId = '12345';
    const changePasswordDto = new ChangePasswordDto();
    changePasswordDto.oldPassword = 'incorrectOldPassword';
    changePasswordDto.newPassword = 'newPassword';

    // Create a user before changing the password
    await service.signup('user@test.com', 'oldPassword');

    await expect(
      service.changePassword(userId, changePasswordDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if the Google login token is invalid', async () => {
    const invalidToken = 'invalidGoogleToken';
    require('google-auth-library').mockVerifyIdToken.mockRejectedValueOnce(
      new Error('Invalid token'),
    );

    await expect(service.googleLogin(invalidToken)).rejects.toThrow(Error);
  });

  it('throws an error if user tries to sign in with a Google-associated email', async () => {
    const googleUserEmail = 'googleUser@test.com';
    const password = 'password';

    // Add a user with Google-associated email to the fake users array
    users.push({
      id: 'googleUserId',
      email: googleUserEmail,
      googleId: 'googleUserGoogleId', // This user has a Google ID, so they're a Google user
      password: null, // Google users don't have a password
    } as User);

    await expect(service.signin(googleUserEmail, password)).rejects.toThrow(
      new ForbiddenException('Please use Google to login'),
    );
  });

  it('throws an error if user tries to change the password of a non-existent user', async () => {
    const nonExistentUserId = 'nonExistentUser12345';
    const changePasswordDto = new ChangePasswordDto();
    changePasswordDto.oldPassword = 'oldPassword';
    changePasswordDto.newPassword = 'newPassword';

    await expect(
      service.changePassword(nonExistentUserId, changePasswordDto),
    ).rejects.toThrow(NotFoundException);
  });
});
