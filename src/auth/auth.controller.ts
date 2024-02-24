import { Body, Controller, Patch, Post, Res } from '@nestjs/common';
import { UserDto } from '../users/dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { Response } from 'express';
import { GoogleLoginDto } from './dto/google-login.dto';
import {
  ChangePasswordDecorator,
  GoogleLoginDecorator,
  LoginUsersDecorator,
  RegisterUsersDecorator,
} from './decorators';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @RegisterUsersDecorator()
  @Post('register')
  async registerUser(
    @Body() body: SignupUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.signup(body.email, body.password);
  }

  @LoginUsersDecorator()
  @Post('login')
  async signin(@Body() body: LoginUserDto) {
    return await this.authService.signin(body.email, body.password);
  }

  @GoogleLoginDecorator()
  @Post('google-login')
  async googleLogin(
    @Body() body: GoogleLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.googleLogin(body.credential);
  }

  @ChangePasswordDecorator()
  @Patch('/change-password')
  async changeMyPassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }
}
