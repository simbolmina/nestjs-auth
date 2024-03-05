import { UseGuards, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { User } from '../entities/user.entity';
import { UserDto } from '../dtos/user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { AdminUpdateUserDto, UpdateUserDto } from '../dtos/update-user.dto';

export function GetAllUsersDecorator() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, AdminGuard),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all users',
      description:
        'This endpoint retrieves all user entries from the database. Only administrators can access this endpoint to view the full list of users.',
    }),
    ApiOkResponse({ description: 'Returns all users', type: [UserDto] }),
    ApiNotFoundResponse({ description: 'No users found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
  );
}

export function GetCurrentUserDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get current user',
      description:
        'This endpoint returns the details of the currently authenticated user. The user must be authenticated with a valid JWT token.',
    }),
    ApiOkResponse({
      description: 'Returns the current user',
      type: UserDto,
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    Serialize(UserDto),
    UseGuards(JwtAuthGuard),
  );
}

export function UpdateCurrentUserDecorator() {
  return applyDecorators(
    Serialize(UserDto),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update current user',
      description:
        'This endpoint allows the currently authenticated user to update their own user details, such as name, gender, etc. Allowed fields are listed in request body example. Each field can separetly be updated, you don"t have to send whole object. The user must be authenticated with a valid JWT token.',
    }),
    ApiOkResponse({
      description: 'Returns the updated user',
      type: UserDto,
    }),
    ApiBadRequestResponse({
      description: 'Invalid data provided',
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiBody({
      description: 'Allowed data to be updated by user',
      type: UpdateUserDto,
    }),
  );
}

export function DeleteCurrentUserDecorator() {
  return applyDecorators(
    Serialize(UserDto),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Deactivate current user',
      description:
        'This endpoint allows the currently authenticated user to deactivate their account. Deactivated accounts are not deleted and can be reactivated. The user must be authenticated with a valid JWT token.',
    }),
    ApiNoContentResponse({
      description: 'User has been deactivated',
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function GetUserByIdDecorator() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, AdminGuard),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get user by ID',
      description:
        "This endpoint retrieves the user entry with the given ID from the database. Only administrators can access this endpoint to view other users' details. Details in this api are full user details so admin can access and edit all user details.",
    }),
    ApiOkResponse({
      description: 'Returns the user with the given ID',
      type: User,
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}

export function GetUserByEmailDecorator() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, AdminGuard),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get users by email',
      description:
        'This endpoint retrieves a user from the database that match the given email. Only administrators can access this endpoint to search for users by their email. Details in this api are full user details so admin can access and edit all user details.',
    }),
    ApiQuery({ name: 'email', description: 'Email to search for users' }),
    ApiOkResponse({
      description: 'Returns users with the given email',
      type: User,
    }),
    ApiNotFoundResponse({ description: 'User not found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
  );
}

export function UpdateUserByIdDecorator() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, AdminGuard),
    ApiBody({
      description: 'Allowed data to be updated by user',
      type: AdminUpdateUserDto,
    }),
    ApiBearerAuth(),
    ApiOkResponse({ type: User }),
    ApiOperation({
      summary: 'Update user by ID',
      description:
        'This endpoint allows an administrator to update user details for any user in the database. Only administrators can access this endpoint.',
    }),
    ApiNotFoundResponse({ description: 'User not found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
  );
}

export function DeleteUserByIdDecorator() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, AdminGuard),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Deactivate user by ID',
      description:
        'This endpoint allows an administrator to deactivate a user account. Deactivated accounts are not deleted and can be reactivated. Only administrators can access this endpoint.',
    }),
    ApiNoContentResponse({ description: 'User has been deactivated' }),
    ApiNotFoundResponse({ description: 'User not found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
  );
}

export function HardDeleteUserByIdDecorator() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, AdminGuard),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete user by ID',
      description:
        'This endpoint allows an administrator to permanently delete a user account from the database. This operation cannot be undone. Only administrators can access this endpoint.',
    }),
    ApiNoContentResponse({ description: 'User has been deleted' }),
    ApiNotFoundResponse({ description: 'User not found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden resource' }),
  );
}
