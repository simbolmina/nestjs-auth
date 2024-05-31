import { Body, Controller, HttpStatus, Patch, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignupUserDto } from './dtos/signup-user.dto';
import { Response } from 'express';
import { GoogleLoginDto } from './dtos/google-login.dto';
import {
  ChangePasswordDecorator,
  ConfirmEmailSetupDecorator,
  ConfirmPhoneSetupDecorator,
  DisableTwoFactorAuthDecorator,
  ForgotPasswordDecorator,
  GoogleLoginDecorator,
  // LoginFromNewDeviceWithTwoFactorDecorator,
  LoginUsersDecorator,
  LoginWithTwoFactorDecorator,
  LogoutUsersDecorator,
  RefreshTokenDecorator,
  RegisterUsersDecorator,
  ResendTwoFactorAuthDecorator,
  ResendTwoFactorAuthForLoginDecorator,
  ResetPasswordDecorator,
  SetupTwoFactorAuthDecorator,
  VerifyEmailSetupDecorator,
  VerifyPhoneSetupDecorator,
  VerifyTwoFactorAuthDecorator,
  VerifyTwoFactorAuthToDisableDecorator,
} from './decorators';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { PasswordService } from './password.service';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthenticatedResponseDto } from './dtos/auth-response.dto';
import { TokenService } from './token.service';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthenticationService } from './two-factor.service';
import { ValidateOtpDto } from './dtos/validate-otp.dto';
import { Resend2faOtpDto } from './dtos/resend-2fa-otp.dto';
import { LoginWithTwoFactorAuthenticationDto } from './dtos/login-with-2fa.dto';
// import { User } from '../users/entities/user.entity';
import { Throttle } from '@nestjs/throttler';
import { VerificationService } from './verification.service';
import { DataToBeVerified } from './enums';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly verificationService: VerificationService,
  ) {}

  @RegisterUsersDecorator()
  @Post('register')
  async registerUser(@Body() body: SignupUserDto) {
    return await this.authService.register(body.email, body.password);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @LoginUsersDecorator()
  @Post('login')
  async signin(@CurrentUser() user: any) {
    if ('tempAuthToken' in user) {
      return { tempAuthToken: user.tempAuthToken };
    }
    return await this.authService.login(user);
  }

  @LogoutUsersDecorator()
  @Post('logout')
  logout(@CurrentUser() user: any) {
    return this.authService.logout(user);
  }

  @LoginWithTwoFactorDecorator()
  @Post('login-with-two-factor-authentication')
  async loginWith2FA(
    @Body() body: LoginWithTwoFactorAuthenticationDto,
    @CurrentUser() user: any,
  ) {
    return await this.authService.loginWithOtp(body, user);
  }

  @ResendTwoFactorAuthForLoginDecorator()
  @Post('resend-two-factor-authentication-for-login')
  async resend2faForLogin(@Body() body: Resend2faOtpDto) {
    return await this.twoFactorAuthenticationService.resend2faForLogin(body);
  }

  // @LoginFromNewDeviceWithTwoFactorDecorator()
  // @Post('login-from-new-device-with-two-factor-authentication')
  // async loginWithOtp(
  //   @Body() body: LoginWithTwoFactorAuthenticationDto,
  // ): Promise<AuthenticatedResponseDto> {
  //   return this.authService.loginWithOtpFromNewDevice(body);
  // }

  @GoogleLoginDecorator()
  @Post('google-login')
  async googleLogin(@Body() body: GoogleLoginDto) {
    return await this.authService.googleLogin(body.credential);
  }

  @ChangePasswordDecorator()
  @Patch('change-password')
  async changeMyPassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    this.passwordService.changePassword(user.id, changePasswordDto);

    const updatedUser = await this.usersService.findOneById(user.id);
    return await this.authService.login(updatedUser);
  }

  @ForgotPasswordDecorator()
  @Post('forgot-password')
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Res() response: Response,
  ): Promise<Response> {
    await this.passwordService.forgotPassword(body.email);
    return response.status(HttpStatus.OK).json({
      message: 'Password reset email is sent ',
    });
  }

  @ResetPasswordDecorator()
  @Post('set-new-password')
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<AuthenticatedResponseDto> {
    return await this.passwordService.resetPassword(
      body.resetToken,
      body.newPassword,
    );
  }

  // @UseGuards(AuthGuard('refresh'))
  @RefreshTokenDecorator()
  @Post('refresh-token')
  async refresh(@CurrentUser() user: any): Promise<AuthenticatedResponseDto> {
    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  @SetupTwoFactorAuthDecorator()
  @Post('enable-2fa')
  async setup2fa(@CurrentUser() user: any): Promise<{ message: string }> {
    return await this.twoFactorAuthenticationService.setup2FA(user);
  }

  @VerifyTwoFactorAuthDecorator()
  @Post('verify-2fa-to-enable')
  async verify2FA(
    @CurrentUser() user: any,
    @Body() body: ValidateOtpDto,
  ): Promise<{ message: string }> {
    return await this.twoFactorAuthenticationService.verify2FA(
      user,
      body,
      true,
    );
  }

  @ResendTwoFactorAuthDecorator()
  @Post('resend-2fa-code')
  async resend2faOtp(@CurrentUser() user: any): Promise<{ message: string }> {
    return this.twoFactorAuthenticationService.resend2faOtp(user.id);
  }

  @DisableTwoFactorAuthDecorator()
  @Post('disable-2fa')
  async disable2faLogin(
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    return this.twoFactorAuthenticationService.setup2FA(user.id);
  }

  @VerifyTwoFactorAuthToDisableDecorator()
  @Post('verify-2fa-to-disable')
  async verify2faForDisable(
    @CurrentUser() user: any,
    @Body() body: ValidateOtpDto,
  ): Promise<{ message: string }> {
    return await this.twoFactorAuthenticationService.verify2FA(
      user,
      body,
      false,
    );
  }

  @VerifyEmailSetupDecorator()
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('verify-email')
  verifyEmailSetup(@CurrentUser() user: any) {
    return this.verificationService.setupPhoneOrEmailVerfication(
      user,
      DataToBeVerified.Email,
    );
  }

  @ConfirmEmailSetupDecorator()
  @Post('confirm-email')
  confirmEmailSetup(@CurrentUser() user: any, @Body() body: ValidateOtpDto) {
    return this.verificationService.verifyEmailVerification(
      user,
      body,
      DataToBeVerified.Email,
    );
  }

  @VerifyPhoneSetupDecorator()
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('verify-phone')
  verifyPhoneSetup(@CurrentUser() user: any) {
    return this.verificationService.setupPhoneOrEmailVerfication(
      user,
      DataToBeVerified.Phone,
    );
  }
  @ConfirmPhoneSetupDecorator()
  @Post('confirm-phone')
  confirmPhoneSetup(@CurrentUser() user: any, @Body() body: ValidateOtpDto) {
    return this.verificationService.verifyEmailVerification(
      user,
      body,
      DataToBeVerified.Phone,
    );
  }
}
