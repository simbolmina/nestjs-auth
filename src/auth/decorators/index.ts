import { UseGuards, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserLoginResponseDto } from '../dto/login-user.dto';
import { UserSignupResponseDto } from '../dto/signup-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

export function RegisterUsersDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'User registration',
      description:
        'This endpoint allows new users to create an account. Users provide an email and password which are then stored in the database. If the operation is successful, a new JWT token is created for the user and returned in a cookie.',
    }),
    ApiCreatedResponse({
      description: 'The user has been successfully created.',
      type: UserLoginResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid data provided or email already in use',
    }),
    ApiForbiddenResponse({
      description: 'The email is associated with a Google account',
    }),
  );
}

export function LoginUsersDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
      description:
        "This endpoint allows existing users to authenticate with the system. Users provide their email and password, and if they match what's in the database, a new JWT token is created for the user and returned in a cookie. If the email does not exist in the database, or if the password does not match, an error message is returned.",
    }),
    ApiOkResponse({
      description: 'Returns the user and access token',
      type: UserSignupResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Wrong email or password',
    }),
    ApiNotFoundResponse({
      description: 'User not found',
    }),
    ApiForbiddenResponse({
      description: 'User is registered through Google',
    }),
  );
}

export function GoogleLoginDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Google login',
      description:
        "This endpoint allows users to authenticate or register using their Google account. The user provides their Google credential and if it's valid, a new JWT token is created for the user and returned in a cookie. If the user does not exist in the database, a new user is created.",
    }),
    ApiCreatedResponse({
      description: 'The user has been successfully logged in or created.',
      type: UserLoginResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid data provided',
    }),
  );
}

export function ChangePasswordDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Change current user password',
      description:
        'This endpoint allows the currently authenticated user to change their password. The user must provide their current password for verification along with the new password. The user must be authenticated with a valid JWT token.',
    }),
    ApiOkResponse({
      description: 'Password has been changed',
    }),
    ApiBadRequestResponse({
      description: 'Invalid data provided',
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiBody({
      description: 'Password change data',
      type: ChangePasswordDto,
    }),
    UseGuards(JwtAuthGuard),
  );
}
