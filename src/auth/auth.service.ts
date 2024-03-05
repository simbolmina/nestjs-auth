import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { OAuth2Client } from 'google-auth-library';
import { User, UserStatus } from 'src/users/entities/user.entity';
import { AccountInactiveException } from 'src/common/exceptions/account-inactive.exception';
import { TokenService } from './token.service';

// Convert scrypt, which originally uses callbacks, to a promise-based function to avoid callback hell.
const scrypt = promisify(_scrypt);

// Initialize the OAuth2Client with the Google client ID from the environment variables.
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async register(email: string, password: string) {
    // Check if the email is already in use
    const user = await this.usersService.findByEmail(email);

    // If the user exists and has a Google ID, they should use Google to log in
    if (user && user.googleId) {
      throw new ForbiddenException(
        'This email is associated with a Google account. Please use Google to sign in.',
      );
    }

    // If the user exists but is not associated with Google, throw an exception
    if (user) throw new BadRequestException('Email is already in use.');

    // Generate a random salt and hash the password with it
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    // Create and save the new user with the hashed password
    const createdUser = await this.usersService.create(
      email.toLowerCase(),
      result,
    );

    // Generate access and refresh tokens for the new user
    const accessToken = await this.tokenService.createAccessToken(createdUser);
    const refreshToken =
      await this.tokenService.createRefreshToken(createdUser);

    // Return the tokens
    return {
      accessToken,
      refreshToken,
    };
  }

  async login(user: User) {
    // Check if the user's account is active
    if (
      user.status === UserStatus.Inactive ||
      user.status === UserStatus.Deleted ||
      user.status === UserStatus.Blocked
    ) {
      throw new AccountInactiveException(
        'Your account is not active. Please contact support.',
      );
    }

    // Generate and return access and refresh tokens for the active user
    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async googleLogin(token: string) {
    // Verify the Google ID token and extract the user's information
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload['sub']; // Extract Google ID

    // Attempt to find or create a user with the Google ID
    let user = await this.usersService.findByGoogleId(googleId);

    if (!user) {
      user = await this.usersService.createFromGoogle({
        email: payload['email'],
        googleId,
        picture: payload['picture'],
        displayName: payload['displayName'],
        firstName: payload['given_name'],
        provider: 'google',
        isActivatedWithEmail: payload['email_verified'],
      });
    }

    // Generate and return access and refresh tokens for the user
    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyUser(email: string, password: string) {
    // Attempt to find the user by email
    const user = await this.usersService.findByEmail(email);
    // Check if the user has previously signed up with Google
    if (user && user.provider === 'google') {
      throw new UnprocessableEntityException(
        'An account with this email address already exists through a different method.',
      );
    }

    // If no user found, throw an exception
    if (!user) {
      throw new NotFoundException('No user found with this email address.');
    }

    // Verify the password against the stored hash
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Incorrect email or password.');
    }

    // Return the verified user
    return user;
  }
}
