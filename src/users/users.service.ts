import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(data: any) {
    const user = this.repo.create(data);
    return await this.repo.save(user);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findByEmail(email: string) {
    return await this.repo.findOneBy({ email });
  }

  async findOneById(id: string) {
    if (!id) {
      return null;
    }
    return await this.repo.findOneBy({ id });
  }

  async update(id: string, attrs: UpdateUserDto) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.save({ ...user, ...attrs });
  }

  async remove(id: string) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.active = false;
    await this.repo.save(user);
    return user;
  }

  async createGoogleUser(
    email: string,
    displayName: string,
    picture: string,
    gender: string,
    birthDate: Date,
    provider: string,
    googleId: string,
  ) {
    const user = this.repo.create({
      email,
      displayName,
      picture,
      isActivatedWithEmail: true,
      gender,
      birthDate,
      provider,
      googleId,
    });
    return await this.repo.save(user);
  }

  async findByGoogleId(googleId: string) {
    return this.repo.findOneBy({ googleId });
  }
}
