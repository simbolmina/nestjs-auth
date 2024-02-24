import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  // Assuming CurrentUser() is a custom decorator to inject the current user's info
  @Get('/my-profile')
  async findByCurrentUser(@CurrentUser() user: User) {
    return await this.profileService.findByUserId(user.id);
  }

  @Patch('/my-profile')
  async updateCurrentUsersProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User,
  ) {
    return await this.profileService.updateByUserId(user.id, updateProfileDto);
  }

  @Get(':profileId')
  async findOne(@Param('profileId') profileId: string) {
    return await this.profileService.findOne(profileId);
  }

  // Assuming admin access is managed by roles and permissions in your guards
  @Get('admin/:profileId')
  async findOneByAdmin(@Param('profileId') profileId: string) {
    // Implementation could be similar or include additional checks for admin access
    return await this.profileService.findOne(profileId);
  }

  @Patch(':profileId')
  async updateOne(
    @Param('profileId') profileId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.profileService.update(profileId, updateProfileDto);
  }

  // Additional methods here...
}
