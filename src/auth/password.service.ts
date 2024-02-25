import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { UsersService } from 'src/users/users.service';
import { EmailService } from '../notifications/email.service';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { AuthenticatedResponseDto } from './dto/auth-response.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    //   private readonly tokenService: TokenService,
  ) {}

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { oldPassword, newPassword } = changePasswordDto;
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(oldPassword, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Old password is incorrect');
    }

    const newSalt = randomBytes(8).toString('hex');
    const newHash = (await scrypt(newPassword, newSalt, 32)) as Buffer;

    user.password = newSalt + '.' + newHash.toString('hex');
    await this.usersService.updateCurrentUser(user.id, user);

    return { message: 'Password successfully updated' };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Bu e-posta adresli kullanıcı bulunamadı.');
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await this.usersService.updateCurrentUser(user.id, {
      passwordResetCode: resetToken,
      passwordResetExpires: resetTokenExpiry,
    });

    await this.emailService.sendForgotPasswordEmail(resetToken, user.email);
  }

  async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<AuthenticatedResponseDto> {
    const user = await this.usersService.findByResetToken(resetToken);
    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new BadRequestException(
        'Şifre sıfırlama anahtarı geçersiz ya da süresi dolmuş.',
      );
    }

    const newSalt = randomBytes(16).toString('hex');
    const newHash = (await scrypt(newPassword, newSalt, 32)) as Buffer;
    const hashedNewPassword = newSalt + '.' + newHash.toString('hex');

    await this.usersService.updateCurrentUser(user.id, {
      password: hashedNewPassword,
      passwordResetCode: null,
      passwordResetExpires: null,
    });

    const payload = { sub: user.id, email: user.email };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
