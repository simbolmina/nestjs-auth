import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { AuthenticatedResponseDto } from './dto/auth-response.dto';
import { TokenService } from './token.service';
import { CryptoService } from './crypto.service';

// Convert scrypt callback function to promise-based to use async/await
const scrypt = promisify(_scrypt);

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly cryptoService: CryptoService,
  ) {}

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { oldPassword, newPassword } = changePasswordDto;

    // Validate the old password
    const isValidOldPassword = await this.cryptoService.validatePassword(
      oldPassword,
      user.password,
    );
    if (!isValidOldPassword) {
      throw new BadRequestException('Old password is incorrect');
    }

    // Hash the new password
    user.password = await this.cryptoService.hashPassword(newPassword);

    // Increment tokenVersion safely
    user.tokenVersion = (user.tokenVersion || 0) + 1; // This ensures that tokenVersion is a number and increments it

    // Save the updated user
    await this.usersService.updateCurrentUser(user.id, user);
  }

  async forgotPassword(email: string): Promise<void> {
    // Find the user by their email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        'User with this email address was not found.',
      );
    }

    // Generate a password reset token and expiry time
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update the user with the reset token and expiry time
    await this.usersService.updateCurrentUser(user.id, {
      passwordResetCode: resetToken,
      passwordResetExpires: resetTokenExpiry,
    });

    // Note: Email service for sending forgot password email should be implemented here
    // await this.emailService.sendForgotPasswordEmail(resetToken, user.email);
  }

  async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<AuthenticatedResponseDto> {
    // Find the user by their password reset token
    const user = await this.usersService.findByResetToken(resetToken);
    // Validate the reset token and its expiry time
    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new BadRequestException(
        'Password reset token is invalid or has expired.',
      );
    }

    // Hash the new password using the CryptoService
    user.password = await this.cryptoService.hashPassword(newPassword);

    // Clear the reset token and expiry time from the user's account
    user.passwordResetCode = null;
    user.passwordResetExpires = null;

    // Update the user's password and reset token fields
    await this.usersService.updateCurrentUser(user.id, user);

    // Generate new access and refresh tokens for the user
    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);

    // Return the new tokens
    return {
      accessToken,
      refreshToken,
    };
  }
}
