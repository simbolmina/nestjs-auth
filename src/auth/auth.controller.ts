import { Body, Controller, HttpStatus, Patch, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignupUserDto } from './dto/signup-user.dto';
import { Response } from 'express';
import { GoogleLoginDto } from './dto/google-login.dto';
import {
  ChangePasswordDecorator,
  ForgotPasswordDecorator,
  GoogleLoginDecorator,
  LoginUsersDecorator,
  RefreshTokenDecorator,
  RegisterUsersDecorator,
  ResetPasswordDecorator,
} from './decorators';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
//import { User } from 'src/users/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PasswordService } from './password.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthenticatedResponseDto } from './dto/auth-response.dto';
import { TokenService } from './token.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private passwordService: PasswordService,
    private tokenService: TokenService,
  ) {}

  @RegisterUsersDecorator()
  @Post('register')
  async registerUser(@Body() body: SignupUserDto) {
    return await this.authService.register(body.email, body.password);
  }

  @LoginUsersDecorator()
  @Post('login')
  async signin(@CurrentUser() user: any) {
    return await this.authService.login(user);
  }

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
    return this.passwordService.changePassword(user.id, changePasswordDto);
  }

  @ForgotPasswordDecorator()
  @Post('forgot-password')
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Res() response: Response,
  ): Promise<Response> {
    await this.passwordService.forgotPassword(body.email);
    return response.status(HttpStatus.OK).json({
      message: 'Şifre sıfırlama E-postası gönderilmiştir.',
    });
  }

  @ResetPasswordDecorator()
  @Post('reset-password')
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
  @Post('refresh')
  async refresh(
    @Body('refreshToken') body: string,
  ): Promise<AuthenticatedResponseDto> {
    return await this.tokenService.refreshToken(body);
  }
}
