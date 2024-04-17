import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UpdateUserDto } from '../users/dtos/update-user.dto';
import { TokenService } from './token.service';
import { PasswordService } from './password.service';
import { CryptoService } from './crypto.service';

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
  let authService: AuthService;
  let userService: Partial<UsersService>;
  let tokenService: Partial<TokenService>;
  let passwordService: Partial<PasswordService>;
  let cryptoService: Partial<CryptoService>;
  let users: User[] = [];

  // Run this function before each test in the suite
  beforeEach(async () => {
    users = []; // Create an array to store fake users

    // Create a fake UsersService with mocked 'find' and 'create' methods
    userService = {
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
      // create: (email: string, password: string) => {
      //   const user = {
      //     email,
      //     password,
      //   } as User;
      //   users.push(user);
      //   return Promise.resolve(user);
      // },

      create: jest
        .fn()
        .mockImplementation((email: string, password: string) => {
          return Promise.resolve({ email, password: `hashed-${password}` }); // Adjust the implementation as needed
        }),

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
      updateCurrentUser: (id: string, attrs: Partial<User>) => {
        let user = userService.findOneById(id);
        if (!user) {
          throw new NotFoundException('user not found');
        }
        user = { ...user, ...attrs };
        return Promise.resolve(user);
      },
    };

    cryptoService = {
      hashPassword: jest.fn().mockImplementation((password: string) => {
        return Promise.resolve(`hashed-${password}`); // Mock hashing logic for testing
      }),
      validatePassword: jest
        .fn()
        .mockImplementation((password: string, hashedPassword: string) => {
          return Promise.resolve(password === hashedPassword); // Simplistic mock validation logic for testing
        }),
    };

    tokenService = {
      createAccessToken: jest.fn().mockImplementation((user: any) => {
        return 'fakeAccessToken'; // Mock token creation logic
      }),
      createRefreshToken: jest.fn().mockImplementation((user: any) => {
        return 'fakeRefreshToken'; // Mock token creation logic
      }),
    };

    // Create a test module with JwtModule and the necessary AuthService and UsersService providers
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('ACCESS_TOKEN_SECRET'),
            signOptions: { expiresIn: '90d' },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: userService,
        },
        {
          provide: TokenService,
          useValue: tokenService,
        },
        {
          provide: PasswordService,
          useValue: passwordService,
        },
        { provide: CryptoService, useValue: cryptoService },
      ],
    }).compile(); // Compile the test module, which resolves the dependencies and creates an instance

    // Get an instance of AuthService from the compiled test module
    authService = module.get(AuthService);
  });

  // Test if an AuthService instance can be created
  it('can create an instance of auth service', async () => {
    expect(authService).toBeDefined();
  });

  it('creates a new user and returns access and refresh tokens', async () => {
    const mockUser = { email: 'user4@test.com', password: '123456' };
    const expectedTokens = {
      accessToken: 'fakeAccessToken',
      refreshToken: 'fakeRefreshToken',
    };

    const result = await authService.register(
      mockUser.email,
      mockUser.password,
    );

    expect(result).toEqual(expectedTokens);
    expect(userService.create).toHaveBeenCalledWith(
      mockUser.email,
      expect.any(String),
    ); // Check if userService.create was called correctly
    // Here, expect.any(String) is used to indicate that we expect a string, but not matching it exactly due to hashing
    expect(tokenService.createAccessToken).toHaveBeenCalledWith(
      expect.objectContaining({ email: mockUser.email }),
    );
    expect(tokenService.createRefreshToken).toHaveBeenCalledWith(
      expect.objectContaining({ email: mockUser.email }),
    );
    // No need to verify that result.password is undefined as password should not be in the token generation response
  });

  // Test if the AuthService throws an error when signing up with an email that is already in use
  it('throws an error if user signs up with email that is in use', async () => {
    const email = 'asdf@asdf.com';
    const password = 'asdf';

    // Simulate existing user
    users.push({ email, password: `hashed-${password}` } as User);

    await expect(authService.register(email, password)).rejects.toThrow(
      BadRequestException,
    );
  });

  // // Test if the AuthService throws an error when signing in with an unused email

  // it('throws if signin is called with an unused email', async () => {
  //   await expect(
  //     authService.signin('asdflkj@asdlfkj.com', 'passdflkj'),
  //   ).rejects.toThrow(NotFoundException);
  // });

  // it('throws if an invalid password is provided', async () => {
  //   await authService.signup('laskdjf@alskdfj.com', 'password');
  //   await expect(
  //     authService.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
  //   ).rejects.toThrow(BadRequestException);
  // });

  // it('returns a user if correct password is provided', async () => {
  //   await authService.signup('test@test.com', 'password');

  //   const user = await authService.signin('test@test.com', 'password');
  //   expect(user).toBeDefined();
  // });

  // it('can handle Google login', async () => {
  //   const token = 'fakeGoogleToken';
  //   const payload = {
  //     sub: '12345',
  //     email: 'test@gmail.com',
  //     picture: 'http://example.com/image.jpg',
  //     displayName: 'Test User',
  //     given_name: 'Test',
  //     family_name: 'User',
  //     email_verified: true,
  //   };

  //   require('google-auth-library').mockVerifyIdToken.mockResolvedValueOnce({
  //     getPayload: () => payload,
  //   });

  //   const response = await authService.googleLogin(token);

  //   expect(response).toBeDefined();
  //   expect(response.data.id).toEqual(payload.sub);
  //   expect(response.data.email).toEqual(payload.email);
  // });

  // it('changes the password and allows the user to sign in with the new password', async () => {
  //   const userId = '12345';
  //   const changePasswordDto = new ChangePasswordDto();
  //   changePasswordDto.oldPassword = 'oldPassword';
  //   changePasswordDto.newPassword = 'newPassword';

  //   // Create a user before changing the password
  //   await authService.signup('user@test.com', 'oldPassword');

  //   const result = await passwordService.changePassword(
  //     userId,
  //     changePasswordDto,
  //   );

  //   // Verify that the message is correct
  //   expect(result.message).toEqual('Password successfully updated');

  //   // Verify that the user is able to sign in with the new password
  //   const user = await authService.signin('user@test.com', 'newPassword');
  //   expect(user).toBeDefined();

  //   // Verify that the findOneById method was called on the UsersService instance
  //   //expect(userService.findOneById).toHaveBeenCalledWith(userId);
  // });

  // // Test if the AuthService throws an error when changing password with an incorrect old password
  // it('throws an error if old password is incorrect when changing password', async () => {
  //   const userId = '12345';
  //   const changePasswordDto = new ChangePasswordDto();
  //   changePasswordDto.oldPassword = 'incorrectOldPassword';
  //   changePasswordDto.newPassword = 'newPassword';

  //   // Create a user before changing the password
  //   await authService.signup('user@test.com', 'oldPassword');

  //   await expect(
  //     passwordService.changePassword(userId, changePasswordDto),
  //   ).rejects.toThrow(BadRequestException);
  // });

  // it('throws an error if the Google login token is invalid', async () => {
  //   const invalidToken = 'invalidGoogleToken';
  //   require('google-auth-library').mockVerifyIdToken.mockRejectedValueOnce(
  //     new Error('Invalid token'),
  //   );

  //   await expect(authService.googleLogin(invalidToken)).rejects.toThrow(Error);
  // });

  // it('throws an error if user tries to sign in with a Google-associated email', async () => {
  //   const googleUserEmail = 'googleUser@test.com';
  //   const password = 'password';

  //   // Add a user with Google-associated email to the fake users array
  //   users.push({
  //     id: 'googleUserId',
  //     email: googleUserEmail,
  //     googleId: 'googleUserGoogleId', // This user has a Google ID, so they're a Google user
  //     password: null, // Google users don't have a password
  //   } as User);

  //   await expect(authService.signin(googleUserEmail, password)).rejects.toThrow(
  //     new ForbiddenException('Please use Google to login'),
  //   );
  // });

  // it('throws an error if user tries to change the password of a non-existent user', async () => {
  //   const nonExistentUserId = 'nonExistentUser12345';
  //   const changePasswordDto = new ChangePasswordDto();
  //   changePasswordDto.oldPassword = 'oldPassword';
  //   changePasswordDto.newPassword = 'newPassword';

  //   await expect(
  //     passwordService.changePassword(nonExistentUserId, changePasswordDto),
  //   ).rejects.toThrow(NotFoundException);
  // });
});
