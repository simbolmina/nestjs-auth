import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from './entities/user.entity';
import { AdminUpdateUserDto, UpdateUserDto } from './dtos/update-user.dto';

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
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  // Creates a new user with the given email and password
  async create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });
    return await this.repo.save(user);
  }

  // Retrieves all users from the database
  async findAll(): Promise<User[]> {
    return await this.repo.find();
  }

  // Finds a user by their email address
  async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOneBy({ email });
  }

  // Finds a single user by their unique identifier
  async findOneById(id: string): Promise<User | null> {
    return await this.repo.findOneBy({ id });
  }

  // Finds a user by their Google ID
  async findByGoogleId(googleId: string): Promise<User | null> {
    return await this.repo.findOneBy({ googleId });
  }

  // Creates a new user from a Google profile
  async createFromGoogle(profile: GoogleProfile): Promise<User> {
    const user = this.repo.create(profile);
    return await this.repo.save(user);
  }

  // Updates current user information
  async updateCurrentUser(
    id: string,
    attrs: Partial<UpdateUserDto>,
  ): Promise<User> {
    const user = await this.repo.preload({ id, ...attrs });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.repo.save(user);
  }

  // Allows admin to update a user's information
  async updateUserByAdmin(
    id: string,
    attrs: Partial<AdminUpdateUserDto>,
  ): Promise<User> {
    const user = await this.repo.preload({ id, ...attrs });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.repo.save(user);
  }

  // Removes a user from the database
  async remove(id: string): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.repo.remove(user);
  }

  // Deactivates a user's account
  async deactivate(id: string): Promise<void> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = UserStatus.Inactive; // Set the user's status to inactive
    await this.repo.save(user); // Save the changes to the database
  }

  // Finds a user by their password reset token
  async findByResetToken(passwordResetCode: string): Promise<User | null> {
    return await this.repo.findOneBy({ passwordResetCode });
  }
}
