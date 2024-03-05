import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { UsersService } from 'src/users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { AuthenticatedResponseDto } from './dto/auth-response.dto';
import { TokenService } from './token.service';

// Convert scrypt callback function to promise-based to use async/await
const scrypt = promisify(_scrypt);

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // Retrieve the user by their ID
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Destructure old and new password values from the DTO
    const { oldPassword, newPassword } = changePasswordDto;
    // Split the user's stored password hash to extract the salt and hash
    const [salt, storedHash] = user.password.split('.');

    // Hash the old password with the stored salt to verify if it matches the stored hash
    const hash = (await scrypt(oldPassword, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Old password is incorrect');
    }

    // Create a new salt and hash for the new password
    const newSalt = randomBytes(8).toString('hex');
    const newHash = (await scrypt(newPassword, newSalt, 32)) as Buffer;
    // Update the user's password with the new salt and hash
    user.password = newSalt + '.' + newHash.toString('hex');
    await this.usersService.updateCurrentUser(user.id, user);

    return { message: 'Password successfully updated' };
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

    // Create a new salt and hash for the new password
    const newSalt = randomBytes(16).toString('hex');
    const newHash = (await scrypt(newPassword, newSalt, 32)) as Buffer;
    const hashedNewPassword = newSalt + '.' + newHash.toString('hex');

    // Update the user's password and clear the reset token and expiry time
    await this.usersService.updateCurrentUser(user.id, {
      password: hashedNewPassword,
      passwordResetCode: null,
      passwordResetExpires: null,
    });

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
