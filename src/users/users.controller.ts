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
  //   Session,
  UseGuards,
  Request,
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

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body.email, body.password);
    return user;
  }

  @Post('signin')
  async signin(@Body() body: CreateUserDto) {
    const { user, access_token } = await this.authService.signin(
      body.email,
      body.password,
    );
    // console.log('user', user);
    return { user, access_token };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  //@Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findUsersByEmail(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Post('/test')
  @UseInterceptors(UserIdInterceptor)
  test(@Body() body: any) {
    console.log('body', body);
    return body;
  }
}

//for session token

// @Get('/whoami')
// whoAmI(@Session() session: any) {
//   return this.usersService.findOne(session.userId);
// }
//   @Post('/signup')
//   async createUser(@Body() body: CreateUserDto, @Session() session: any) {
//     const user = await this.authService.signup(body.email, body.password);
//     session.userId = user.id;
//     return user;
//   }

//   @Post('/signin')
//   async signin(@Body() body: CreateUserDto, @Session() session: any) {
//     const user = await this.authService.signin(body.email, body.password);
//     session.userId = user.id;
//     return user;
//   }

//   @Post('/signout')
//   signout(@Session() session: any) {
//     session.userId = null;
//   }
