import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRoles, UserStatus } from './entities/user.entity';
import { AdminUpdateUserDto, UpdateUserDto } from './dtos/update-user.dto';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { UsersQueryDto } from './dtos/user-query.dto';
import { SortOrder } from 'src/common/enums';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PaginatedUserDto } from './dtos/paginated-users.dto';

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
  private readonly userCachePrefix = 'user_'; // Prefix for user cache keys

  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // Creates a new user with the given email and password
  async create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });
    return await this.repo.save(user);
  }

  // Retrieves all users from the database
  async findAll(queryDto: UsersQueryDto): Promise<PaginatedUserDto> {
    const { page, limit, sortBy, sortOrder, ...filters } = queryDto;

    // Create query builder
    const queryBuilder = this.repo.createQueryBuilder('user');

    // Apply filters, excluding status for special handling
    Object.keys(filters).forEach((key) => {
      if (key !== 'status' && filters[key]) {
        queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: filters[key] });
      }
    });

    // Handle status as a special case, allowing for array-based filtering
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        queryBuilder.andWhere('user.status IN (:...status)', {
          status: filters.status,
        });
      } else {
        queryBuilder.andWhere('user.status = :status', {
          status: filters.status,
        });
      }
    }

    // Apply sorting
    const sortField = sortBy || 'createdAt'; // Default sorting field
    const sortOrderValue = sortOrder === SortOrder.ASC ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`user.${sortField}`, sortOrderValue);

    // Pagination
    const skip = ((page || 1) - 1) * (limit || 10);
    queryBuilder.skip(skip).take(limit);

    // Execute the query
    const [results, totalItems] = await queryBuilder.getManyAndCount();

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / (limit || 10));

    return {
      data: results,
      meta: {
        page: page || 1,
        pageSize: limit || 10,
        totalItems,
        totalPages,
      },
    };
  }

  // Finds a user by their email address
  async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOneBy({ email });
  }

  // Finds a single user by their unique identifier
  async findOneById(id: string): Promise<User | null> {
    const cacheKey = `${this.userCachePrefix}${id}`;
    try {
      // Attempt to retrieve the user from cache
      const cachedItem: User | null = await this.cacheManager.get(cacheKey);
      if (cachedItem) {
        console.log(`Cache hit for user ID: ${id}`); // Logging cache hit
        return cachedItem;
      }
      console.log(`Cache miss for user ID: ${id}`); // Logging cache miss

      // Cache miss, retrieve the user from the database
      const user = await this.repo.findOneBy({ id });
      if (user) {
        // Cache the user data for future requests, consider dynamic TTL based on context
        await this.cacheManager.set(cacheKey, user, 10000);
      }
      return user;
    } catch (error) {
      console.error(
        `Cache error for user ID: ${id}, falling back to database. Error: ${error}`,
      );
      // On cache error, fallback to database read
      return await this.repo.findOneBy({ id });
    }
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
    await this.repo.save(user);

    // Invalidate the cache upon user update to ensure consistency
    const cacheKey = `${this.userCachePrefix}${id}`;
    await this.cacheManager.del(cacheKey);
    console.log(`Cache invalidated for user ID: ${id}`); // Logging cache invalidation

    return user;
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

  async update(id: string, updateData: Partial<User>): Promise<any> {
    return await this.repo.update(id, updateData);
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

  async banUser(id: string): Promise<void> {
    // Retrieve the user from the database
    const user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the user's status and token version
    user.status = UserStatus.Blocked;
    user.tokenVersion += 1;
    await this.repo.save(user);

    // Delete refresh tokens
    await this.refreshTokenRepo.delete({ user: user });
  }

  async assignRole(userId: string, role: UserRoles): Promise<void> {
    const user = await this.repo.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    user.role = role;
    await this.repo.save(user);
  }
}
