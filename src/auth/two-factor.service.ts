import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthenticatedResponseDto } from './dtos/auth-response.dto';
import { TokenService } from './token.service';
import { CryptoService } from './crypto.service';
import { EmailService } from 'src/common/email.service';
import { ValidateOtpDto } from './dtos/validate-otp.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TwoFactorAuthenticationService {
  private readonly logger = new Logger(TwoFactorAuthenticationService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly cryptoService: CryptoService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async setup2FA(user: any): Promise<{ message: string }> {
    const [otp, hashedOtp] =
      await this.cryptoService.generateAndHashOtp6Figures();
    await this.usersService.updateCurrentUser(user.id, {
      twoFactorAuthToken: hashedOtp,
      twoFactorAuthTokenExpiry: new Date(Date.now() + 3600000), // 1 hour validity
    });
    await this.emailService.sendOtpEmail(user.email, otp);
    return { message: 'OTP Code Has Been Sent' };
  }

  async verify2FA(
    user: any,
    verify2FADto: ValidateOtpDto,
  ): Promise<{ message: string }> {
    const { otp } = verify2FADto;
    const validatedUser = await this.getUserAndValidateOtp(user.email, otp);

    await this.usersService.updateCurrentUser(validatedUser.id, {
      isTwoFactorAuthEnabled: true,
      twoFactorAuthToken: null,
      twoFactorAuthTokenExpiry: null,
    });

    return { message: '2FA Setup Successful' };
  }

  async getUserAndValidateOtp(email: string, otp: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.twoFactorAuthToken) {
      throw new NotFoundException('No user or OTP code found for this email.');
    }

    if (new Date(Date.now()) > user.twoFactorAuthTokenExpiry) {
      throw new BadRequestException(
        'The OTP code has expired. Please request a new one.',
      );
    }
    const isOtpValid = await this.cryptoService.validateOtp(
      otp,
      user.twoFactorAuthToken,
    );
    if (!isOtpValid) {
      throw new UnauthorizedException('Invalid OTP code. Please try again.');
    }
    return user;
  }

  async resend2faOtp(userId: string): Promise<{ message: string }> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (
      !user.twoFactorAuthToken ||
      new Date(Date.now()) > user.twoFactorAuthTokenExpiry
    ) {
      throw new BadRequestException(
        'No ongoing 2FA process found. Please initiate setup first.',
      );
    }

    // Generate and hash a new OTP
    const [generatedOtp, hashedOtp] =
      await this.cryptoService.generateAndHashOtp6Figures();

    // Send the new OTP email
    await this.emailService.sendOtpEmail(user.email, generatedOtp);

    // Update the OTP and expiry time in the user's document
    await this.usersService.updateCurrentUser(user.id, {
      twoFactorAuthToken: hashedOtp,
      twoFactorAuthTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
    });

    return { message: 'OTP has been resent.' };
  }
}
