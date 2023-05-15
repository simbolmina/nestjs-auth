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
  ApiBody,
} from '@nestjs/swagger';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('users') // Groups endpoints under the 'users' tag in the Swagger UI
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard, new AdminGuard())
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users', type: [User] })
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Serialize(UserDto)
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({
    description: 'Returns the current user',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Serialize(UserDto)
  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user' })
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
  updateCurrentUser(
    @CurrentUser() user: User,
    @Body() body: Partial<UpdateUserDto>,
  ) {
    return this.usersService.update(user.id, body);
  }

  @Serialize(UserDto)
  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate current user' })
  @ApiOkResponse({
    description: 'User has been deactivated',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  removeCurrentUser(@CurrentUser() user: User) {
    return this.usersService.deactivate(user.id);
  }

  @UseGuards(JwtAuthGuard, new AdminGuard())
  @Get('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the given ID',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard, new AdminGuard())
  @Get('/:email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get users by email' })
  @ApiQuery({ name: 'email', description: 'Email to search for users' })
  @ApiResponse({
    status: 200,
    description: 'Returns users with the given email',
    type: [User],
  })
  findUsersByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // this is actually a PATCH request that sets user.active = false
  @UseGuards(JwtAuthGuard, new AdminGuard())
  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User has been deactivated' })
  async removeUser(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @UseGuards(JwtAuthGuard, new AdminGuard())
  @Patch('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }
}
