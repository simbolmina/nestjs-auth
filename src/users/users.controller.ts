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
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserIdInterceptor } from './interceptors/user-id.interceptor';
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
} from '@nestjs/swagger';
import { LoginUserDto } from './dtos/login-user.dto';

@ApiTags('users') // Groups endpoints under the 'users' tag in the Swagger UI
@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Indicates that this route requires Bearer authentication (JWT)
  @ApiOperation({ summary: 'Get current user' }) // Describes the operation
  @ApiOkResponse({
    description: 'Returns the current user',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' }) // Describes possible 401 response
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('signup')
  @ApiOperation({ summary: 'User registration' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided or email already in use',
  }) // Describes possible 400 response
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body.email, body.password);
    return user;
  }

  @Post('signin')
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({
    description: 'Returns the user and access token',
    type: CreateUserDto,
  })
  @ApiBadRequestResponse({
    description: 'Wrong email or password',
  }) // Describes possible 400 response
  @ApiNotFoundResponse({
    description: 'User not found',
  }) // Describes possible 404 response
  async signin(@Body() body: LoginUserDto) {
    const { user, access_token } = await this.authService.signin(
      body.email,
      body.password,
    );
    return { user, access_token };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users', type: [User] })
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the given ID',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  @ApiOperation({ summary: 'Get users by email' })
  @ApiQuery({ name: 'email', description: 'Email to search for users' })
  @ApiResponse({
    status: 200,
    description: 'Returns users with the given email',
    type: [User],
  })
  findUsersByEmail(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User has been removed' })
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }
}
