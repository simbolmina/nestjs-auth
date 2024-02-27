import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminUpdateUserDto, UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users',
    description:
      'This endpoint retrieves all user entries from the database. Only administrators can access this endpoint to view the full list of users.',
  })
  @ApiOkResponse({ description: 'Returns all users', type: [User] })
  @ApiNotFoundResponse({ description: 'No users found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  async findAllUsers() {
    const users = await this.usersService.findAll();
    if (!users.length) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description:
      'This endpoint returns the details of the currently authenticated user. The user must be authenticated with a valid JWT token.',
  })
  @ApiOkResponse({
    description: 'Returns the current user',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Serialize(UserDto)
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User) {
    console.log('GetMe', user);
    return user;
  }

  @Serialize(UserDto)
  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update current user',
    description:
      'This endpoint allows the currently authenticated user to update their own user details, such as name, gender, etc. Allowed fields are listed in request body example. Each field can separetly be updated, you don"t have to send whole object. The user must be authenticated with a valid JWT token.',
  })
  @ApiOkResponse({
    description: 'Returns the updated user',
    type: UserDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({
    description: 'Allowed data to be updated by user',
    type: UpdateUserDto,
  })
  async updateCurrentUser(
    @CurrentUser() user: User,
    @Body() body: Partial<UpdateUserDto>,
  ) {
    return await this.usersService.updateCurrentUser(user.id, body);
  }

  @Serialize(UserDto)
  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deactivate current user',
    description:
      'This endpoint allows the currently authenticated user to deactivate their account. Deactivated accounts are not deleted and can be reactivated. The user must be authenticated with a valid JWT token.',
  })
  @ApiNoContentResponse({
    description: 'User has been deactivated',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async removeCurrentUser(@CurrentUser() user: User) {
    return await this.usersService.deactivate(user.id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      "This endpoint retrieves the user entry with the given ID from the database. Only administrators can access this endpoint to view other users' details. Details in this api are full user details so admin can access and edit all user details.",
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({
    description: 'Returns the user with the given ID',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/:email')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get users by email',
    description:
      'This endpoint retrieves a user from the database that match the given email. Only administrators can access this endpoint to search for users by their email. Details in this api are full user details so admin can access and edit all user details.',
  })
  @ApiQuery({ name: 'email', description: 'Email to search for users' })
  @ApiOkResponse({
    description: 'Returns users with the given email',
    type: User,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  async findUserByEmail(@Query('email') email: string) {
    return await this.usersService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('/:id')
  @ApiBody({
    description: 'Allowed data to be updated by user',
    type: AdminUpdateUserDto,
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  @ApiOperation({
    summary: 'Update user by ID',
    description:
      'This endpoint allows an administrator to update user details for any user in the database. Only administrators can access this endpoint.',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async updateUser(@Param('id') id: string, @Body() body: Partial<User>) {
    return await this.usersService.updateUserByAdmin(id, body);
  }

  // this is actually a PATCH request that sets user.active = false
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Deactivate user by ID',
    description:
      'This endpoint allows an administrator to deactivate a user account. Deactivated accounts are not deleted and can be reactivated. Only administrators can access this endpoint.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiNoContentResponse({ description: 'User has been deactivated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  async removeUser(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('/:id/delete')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user by ID',
    description:
      'This endpoint allows an administrator to permanently delete a user account from the database. This operation cannot be undone. Only administrators can access this endpoint.',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiNoContentResponse({ description: 'User has been deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
