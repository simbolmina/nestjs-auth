import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { OAuth2Client } from 'google-auth-library';
import { User, UserStatus } from '../users/entities/user.entity';
import { AccountInactiveException } from '../common/exceptions/account-inactive.exception';
import { TokenService } from './token.service';
import { CryptoService } from './crypto.service';
import { TwoFactorAuthenticationService } from './two-factor.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedResponseDto } from './dtos/auth-response.dto';
import { LoginWithTwoFactorAuthenticationDto } from './dtos/login-with-2fa.dto';

// Initialize the OAuth2Client with the Google client ID from the environment variables.
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly cryptoService: CryptoService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly jwtService: JwtService,
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

    // Hash the password using the CryptoService
    const hashedPassword = await this.cryptoService.hashPassword(password);

    // Create and save the new user with the hashed password
    const createdUser = await this.usersService.create(
      email.toLowerCase(), // Good practice to normalize emails
      hashedPassword,
    );

    // Generate access and refresh tokens for the new user
    const accessToken = await this.tokenService.createAccessToken(createdUser);
    const refreshToken =
      await this.tokenService.createRefreshToken(createdUser);

    this.logger.log(
      JSON.stringify({
        action: 'register',
        userId: user.id,
        email: user.email,
      }),
    );
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

    if (user.isTwoFactorAuthEnabled) {
      this.logger.log(
        JSON.stringify({
          action: 'login-2fa-attempt',
          userId: user.id,
          method: 'email',
        }),
      );
      const tempAuthToken = this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '10m' },
      );
      const setupResult =
        await this.twoFactorAuthenticationService.setup2FA(user);

      return {
        tempAuthToken: tempAuthToken,
        message: setupResult.message,
      };
    } else {
      // User does not have 2FA enabled, proceed with normal login
      const accessToken = await this.tokenService.createAccessToken(user);
      const refreshToken = await this.tokenService.createRefreshToken(user);

      this.logger.log(
        JSON.stringify({
          action: 'login',
          userId: user.id,
          method: 'email',
        }),
      );

      return {
        accessToken,
        refreshToken,
        message: 'Login successful.',
      };
    }
  }

  // async loginWithOtp(
  //   body: LoginWithTwoFactorAuthenticationDto,
  // ): Promise<AuthenticatedResponseDto> {
  //   // Decode tempAuthToken to get userId
  //   const decoded = this.jwtService.verify(body.tempAuthToken);
  //   const user = await this.usersService.findOneById(decoded.userId);

  //   // Perform OTP verification
  //   const isOtpValid = await this.cryptoService.validateOtp(
  //     body.otp,
  //     user.twoFactorAuthToken,
  //   );

  //   if (!isOtpValid) {
  //     throw new UnauthorizedException('Invalid OTP. Please try again.');
  //   }

  //   // Generate the real access and refresh tokens upon successful OTP verification
  //   const accessToken = await this.tokenService.createAccessToken(user);
  //   const refreshToken = await this.tokenService.createRefreshToken(user);

  //   return {
  //     accessToken,
  //     refreshToken,
  //   };
  // }

  async loginWithOtp(
    body: LoginWithTwoFactorAuthenticationDto,
    user: any,
  ): Promise<AuthenticatedResponseDto> {
    const isOtpValid = await this.cryptoService.validateOtp(
      body.otp,
      user.twoFactorAuthToken,
    );

    if (!isOtpValid) {
      throw new UnauthorizedException(
        'Invalid Two Factor Autentication Code. Please try again.',
      );
    }

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

    this.logger.log(
      JSON.stringify({
        action: 'login',
        userId: user.id,
        method: 'google',
      }),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyUser(email: string, password: string): Promise<User> {
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

    // Verify the password against the stored hash using the CryptoService
    const isValidPassword = await this.cryptoService.validatePassword(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException('Incorrect email or password.');
    }

    // Return the verified user
    return user;
  }
}
