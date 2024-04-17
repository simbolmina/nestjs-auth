import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from './crypto.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    //   @InjectModel(PhoneVerification.name)
    //   private phoneVerificationModel: Model<PhoneVerification>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    //   private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    //   private readonly smsService: SmsService,
    private readonly cryptoService: CryptoService,
  ) {}

  // async getUserAndValidateOtp(email: string, otp: string) {
  //   this.logger.log(
  //     JSON.stringify({
  //       action: 'getUserAndValidateOtp',
  //     }),
  //   );
  //   const user = await this.usersService.findUserByEmail(email);
  //   if (!user || !user.twoFactorAuthToken) {
  //     throw new NotFoundException(
  //       'Bu e-posta için bir kullanıcı ya da OTP kodu bulunamadı.',
  //     );
  //   }

  //   if (Date.now() > user.twoFactorAuthTokenExpiry) {
  //     throw new BadRequestException(
  //       'Anahtarın kodunun süresi dolmuş. Lütfen yeni bir tane isteyin.',
  //     );
  //   }
  //   const isOtpValid = await bcrypt.compare(otp, user.twoFactorAuthToken);
  //   if (!isOtpValid) {
  //     throw new UnauthorizedException(
  //       'Geçersiz OTP kodu. Lütfen tekrar deneyin.',
  //     );
  //   }
  //   return user;
  // }

  // async loginWithOtpFromNewDevice(body: LoginWithOtpDto) {
  //   // Decode the temporary authentication token to get the user ID and OTP
  //   let decodedToken;
  //   try {
  //     decodedToken = this.jwtService.verify(body.tempAuthToken);
  //   } catch (error) {
  //     throw new UnauthorizedException(
  //       'Geçersiz geçici giriş anahtarı, lütfen tekrar deneyiniz.',
  //     );
  //   }

  //   const user = await this.usersService.getUserById(decodedToken.userId);
  //   if (!user) {
  //     throw new NotFoundException(
  //       'Kullanıcı bulunamadı, lütfen bilgileri kontrol edip tekrar deneyiniz.',
  //     );
  //   }
  //   if (decodedToken.otp !== body.otp) {
  //     throw new UnauthorizedException(
  //       'Geçersiz OTP kodu. Lütfen tekrar deneyin.',
  //     );
  //   }

  //   // Mark the device as recognized by adding it to the knownDevices list
  //   const isNewDevice = !user.knownDevices.find(
  //     (device) => device.deviceId === body.deviceId,
  //   );
  //   if (isNewDevice) {
  //     user.knownDevices.push({
  //       deviceId: body.deviceId,
  //       firstUsed: new Date(),
  //       lastUsed: new Date(),
  //     });
  //     await user.save(); // Assuming you have a method to save/update the user
  //   }

  //   const token = await this.tokenService.createAccessToken(user);
  //   const refreshToken = await this.tokenService.createRefreshToken(user);

  //   this.logger.log(
  //     JSON.stringify({
  //       action: 'verifyOtp',
  //     }),
  //   );

  //   const loginResponse: any = { token, refreshToken };

  //   loginResponse.accountStatus = user.status;
  //   loginResponse.isEmailVerified = user.isEmailVerified;
  //   loginResponse.isPhoneVerified = user.isPhoneVerified;

  //   // Return the response object
  //   return loginResponse;
  // }

  // async requestOtpReset(email: string): Promise<void> {
  //   const [otp, hashedOtp] = await this.generateAndHashOtp6Figures();
  //   const user = await this.usersService.findUserByEmail(email);
  //   if (!user) {
  //     throw new NotFoundException(
  //       'Kullanıcı bulunamadı, lütfen bilgileri kontrol edip tekrar deneyiniz.',
  //     );
  //   }
  //   await this.usersService.updateUser(user._id.toHexString(), {
  //     passwordResetToken: hashedOtp,
  //     passwordResetTokenExpiry: Date.now() + 3600000, // Token valid for 1 hour
  //   });
  //   await this.emailService.sendOtpEmail(email, otp, 'Tevkil Şifre Sıfırlama');
  //   this.logger.log(
  //     JSON.stringify({
  //       action: 'requestOtpReset',
  //     }),
  //   );
  // }

  // async verify2FA(user: User, verify2FADto: ValidateOtpDto): Promise<void> {
  //   const { otp } = verify2FADto;
  //   const validatedUser = await this.getUserAndValidateOtp(user.email, otp);

  //   await this.usersService.updateUser(validatedUser._id.toHexString(), {
  //     isTwoFactorAuthEnabled: true,
  //     twoFactorAuthToken: null,
  //     twoFactorAuthTokenExpiry: null,
  //   });
  // }

  // async resenOtpLoginFromNewDevice(tempAuthToken: string) {
  //   // Decode the existing temporary authentication token to get the user ID
  //   let decodedToken;
  //   try {
  //     decodedToken = this.jwtService.verify(tempAuthToken);
  //   } catch (error) {
  //     throw new UnauthorizedException(
  //       'Invalid temporary authentication token.',
  //     );
  //   }

  //   const user = await this.usersService.getUserById(decodedToken.userId);
  //   if (!user) {
  //     throw new NotFoundException('User not found.');
  //   }

  //   // Generate and hash a new OTP using OtpService
  //   const [generatedOtp, hashedOtp] = await this.generateAndHashOtp6Figures();

  //   // Send the new OTP email using EmailService
  //   await this.smsService.sendSMS(user.phone, generatedOtp);

  //   // Update the OTP and expiry time in the user's document
  //   const twoFactorAuthTokenExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  //   await this.usersService.updateUser(user.id, {
  //     twoFactorAuthToken: hashedOtp,
  //     twoFactorAuthTokenExpiry,
  //   });

  //   // Generate a new temporary authentication token with the new OTP
  //   const newTempAuthToken = this.jwtService.sign({
  //     userId: user._id.toHexString(),
  //     otp: generatedOtp,
  //   });

  //   return { tempAuthToken: newTempAuthToken };
  // }

  // async resen2fadOtp(tempAuthToken: string) {
  //   // Decode the existing temporary authentication token to get the user ID
  //   let decodedToken;
  //   try {
  //     decodedToken = this.jwtService.verify(tempAuthToken);
  //   } catch (error) {
  //     throw new UnauthorizedException(
  //       'Invalid temporary authentication token.',
  //     );
  //   }

  //   const user = await this.usersService.getUserById(decodedToken.userId);
  //   if (!user) {
  //     throw new NotFoundException('User not found.');
  //   }

  //   // Generate and hash a new OTP using OtpService
  //   const [generatedOtp, hashedOtp] = await this.generateAndHashOtp6Figures();

  //   // Send the new OTP email using EmailService
  //   await this.emailService.sendOtpEmail(
  //     user.email,
  //     generatedOtp,
  //     '2FA Login OTP',
  //   );

  //   // Update the OTP and expiry time in the user's document
  //   const twoFactorAuthTokenExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  //   await this.usersService.updateUser(user.id, {
  //     twoFactorAuthToken: hashedOtp,
  //     twoFactorAuthTokenExpiry,
  //   });

  //   // Generate a new temporary authentication token with the new OTP
  //   const newTempAuthToken = this.jwtService.sign({
  //     userId: user._id.toHexString(),
  //     otp: generatedOtp,
  //   });

  //   return { tempAuthToken: newTempAuthToken };
  // }
}
