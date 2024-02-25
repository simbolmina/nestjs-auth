import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createProfile(userId: string) {
    const savedProfile = this.profileRepository.create({ userId });
    await this.profileRepository.save(savedProfile);
  }

  async findByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Profile not found.');
    }
    return profile;
  }

  async findCurrentUserProfile(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Profile not found.');
    }

    const responseDto = plainToClass(ProfileResponseDto, profile, {
      excludeExtraneousValues: true,
    });

    return responseDto;
  }

  async updateByUserId(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.findByUserId(userId);
    const updated = this.profileRepository.merge(profile, updateProfileDto);
    const savedProfile = this.profileRepository.save(updated);
    const responseDto = plainToClass(ProfileResponseDto, savedProfile, {
      excludeExtraneousValues: true,
    });

    return responseDto;
  }

  async findOne(profileId: string): Promise<Profile> {
    const profile = await this.profileRepository.findOneBy({ id: profileId });
    if (!profile) {
      throw new NotFoundException('Profile not found.');
    }
    return profile;
  }

  async update(
    profileId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.findOne(profileId);
    const updated = this.profileRepository.merge(profile, updateProfileDto);
    return this.profileRepository.save(updated);
  }
}
