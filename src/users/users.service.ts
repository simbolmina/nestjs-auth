import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AdminUpdateUserDto, UpdateUserDto } from './dtos/update-user.dto';
import { EventEmitter2 } from 'eventemitter2';

export type GoogleProfile = {
  email: string;
  googleId: string;
  picture: string;
  displayName: string;
  isActivatedWithEmail: boolean;
  firstName: string;
  provider: string;
};

@Injectable()
export class UsersService {
  private readonly _onUserCreated = new EventEmitter2();

  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  get onUserCreated() {
    return this._onUserCreated;
  }

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    const savedUser = await this.repo.save(user);
    this._onUserCreated.emit('user.created', savedUser.id); // Emit after save
    return savedUser;
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

  async findByGoogleId(googleId: string) {
    return this.repo.findOneBy({ googleId });
  }

  // inside your UsersService
  async createFromGoogle(profile: GoogleProfile): Promise<User> {
    const user = this.repo.create(profile);
    return this.repo.save(user);
  }

  async updateCurrentUser(id: string, attrs: Partial<UpdateUserDto>) {
    const user = await this.repo.preload({ id, ...attrs });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.save(user);
  }

  async updateUserByAdmin(id: string, attrs: Partial<AdminUpdateUserDto>) {
    const user = await this.repo.preload({ id, ...attrs });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.active = false;
    await this.repo.save(user);
    return user;
  }
}
