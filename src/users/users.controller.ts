import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import {
  DeleteCurrentUserDecorator,
  DeleteUserByIdDecorator,
  GetAllUsersDecorator,
  GetCurrentUserDecorator,
  GetUserByEmailDecorator,
  GetUserByIdDecorator,
  HardDeleteUserByIdDecorator,
  UpdateCurrentUserDecorator,
  UpdateUserByIdDecorator,
} from './decorators';
import { UpdateMeDto } from './dtos/update-me.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GetAllUsersDecorator()
  @Get()
  async findAllUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @GetCurrentUserDecorator()
  @Get('/me')
  getMe(@CurrentUser() user: any): Promise<User> {
    return user;
  }

  @UpdateCurrentUserDecorator()
  @Patch('/me')
  async updateCurrentUser(
    @CurrentUser() user: any,
    @Body() body: UpdateMeDto,
  ): Promise<User> {
    return await this.usersService.updateCurrentUser(user.id, body);
  }

  @DeleteCurrentUserDecorator()
  @Delete('/me')
  async removeCurrentUser(@CurrentUser() user: any): Promise<void> {
    await this.usersService.deactivate(user.id);
  }

  @GetUserByIdDecorator()
  @Get('/:id')
  async findUser(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @GetUserByEmailDecorator()
  @Get('/:email')
  async findUserByEmail(@Query('email') email: string) {
    return await this.usersService.findByEmail(email);
  }

  @UpdateUserByIdDecorator()
  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: Partial<User>) {
    return await this.usersService.updateUserByAdmin(id, body);
  }

  // this is actually a PATCH request that sets user.active = false
  @DeleteUserByIdDecorator()
  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @HardDeleteUserByIdDecorator()
  @Delete('/:id/delete')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
