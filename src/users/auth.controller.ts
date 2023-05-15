import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  UseGuards,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { LoginUserDto, UserLoginResponseDto } from './dtos/login-user.dto';
import { SignupUserDto, UserSignupResponseDto } from './dtos/signup-user.dto';
import { Response } from 'express';
import { GoogleLoginDto } from './dtos/google-login.dto';

@ApiTags('auth') // Groups endpoints under the 'users' tag in the Swagger UI
@Serialize(UserDto)
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'User registration' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UserLoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided or email already in use',
  })
  @ApiForbiddenResponse({
    description: 'The email is associated with a Google account',
  })
  async registerUser(
    @Body() body: SignupUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, token } = await this.authService.signup(
      body.email,
      body.password,
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    return { data, token };
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({
    description: 'Returns the user and access token',
    type: UserSignupResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Wrong email or password',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiForbiddenResponse({
    description: 'User is registered through Google',
  })
  async signin(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, token } = await this.authService.signin(
      body.email,
      body.password,
    );
    // Set the JWT token as a cookie in the response
    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    return { data, token };
  }

  @Post('google-login')
  @ApiOperation({ summary: 'Google login' })
  @ApiCreatedResponse({
    description: 'The user has been successfully logged in or created.',
    type: UserLoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
  })
  async googleLogin(
    @Body() body: GoogleLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // console.log(body);
    const { data, token } = await this.authService.googleLogin(body.credential);

    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    return { data, token };
  }
}
