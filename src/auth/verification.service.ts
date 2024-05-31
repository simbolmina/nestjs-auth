import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CryptoService } from './crypto.service';
import { User } from 'src/users/entities/user.entity';
import { EmailService } from 'src/notifications/email.service';
import { DataToBeVerified } from './enums';
import { ValidateOtpDto } from './dtos/validate-otp.dto';
import { SmsService } from 'src/notifications/sms.service';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  async setupPhoneOrEmailVerfication(
    user: User,
    dataToBeVerified: DataToBeVerified,
  ): Promise<{ message: string }> {
    const [generatedOtp, hashedOtp] =
      await this.cryptoService.generateAndHashOtp6Figures();

    if (dataToBeVerified === DataToBeVerified.Email) {
      if (user.isEmailVerified === true) {
        throw new BadRequestException();
      }
      await this.usersService.update(user.id, {
        verifyEmailToken: hashedOtp,
        verifyEmailExpires: new Date(Date.now() + 3600000),
      });
      await this.emailService.sendOtpEmail(user.email, generatedOtp);

      return { message: 'OTP Code Has Been Sent' };
    } else {
      if (user.isPhoneVerified === true) {
        throw new BadRequestException();
      }
      await this.usersService.update(user.id, {
        verifyPhoneToken: hashedOtp,
        verifyPhoneExpires: new Date(Date.now() + 3600000),
      });
      await this.smsService.sendSMS(user.phoneNumber, generatedOtp);

      return { message: 'OTP Code Has Been Sent' };
    }
  }

  async verifyEmailVerification(
    user: any,
    verify2FADto: ValidateOtpDto,
    dataToBeVerified: DataToBeVerified,
  ): Promise<{ message: string }> {
    const { otp } = verify2FADto;

    if (dataToBeVerified === DataToBeVerified.Email) {
      const validatedUser = await this.getUserAndValidateOtp(
        DataToBeVerified.Email,
        user,
        otp,
      );
      await this.usersService.update(validatedUser.id, {
        isEmailVerified: true,
        verifyEmailToken: null,
        verifyEmailExpires: null,
      });

      return { message: 'Email has been verified' };
    } else {
      const validatedUser = await this.getUserAndValidateOtp(
        DataToBeVerified.Phone,
        user,
        otp,
      );
      await this.usersService.update(validatedUser.id, {
        isPhoneVerified: true,
        verifyPhoneToken: null,
        verifyPhoneExpires: null,
      });

      return { message: 'Phone number has been verified' };
    }
  }

  async getUserAndValidateOtp(
    valueToValidate: DataToBeVerified,
    user: User,
    otp: string,
  ) {
    if (!user) {
      throw new NotFoundException();
    }
    if (valueToValidate === DataToBeVerified.Email) {
      if (!user.verifyEmailToken) {
        throw new NotFoundException();
      }

      if (new Date(Date.now()) > user.verifyEmailExpires) {
        throw new BadRequestException();
      }
      const isOtpValid = await this.cryptoService.validateOtp(
        otp,
        user.verifyEmailToken,
      );
      if (!isOtpValid) {
        throw new UnauthorizedException();
      }
      return user;
    } else {
      if (!user.verifyPhoneToken) {
        throw new NotFoundException();
      }

      if (new Date(Date.now()) > user.verifyPhoneExpires) {
        throw new BadRequestException();
      }
      const isOtpValid = await this.cryptoService.validateOtp(
        otp,
        user.verifyPhoneToken,
      );
      if (!isOtpValid) {
        throw new UnauthorizedException();
      }
      return user;
    }
  }
}
