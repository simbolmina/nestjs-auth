import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { RefreshToken } from './entities/refresh-token.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

// Convert scrypt callback function to a promise-based version for async use
const scryptAsync = promisify(scrypt);

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly REFRESH_TOKEN_SECRET: string;
  private readonly ACCESS_TOKEN_SECRET: string;

  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Retrieve secrets for token signing from the configuration
    this.REFRESH_TOKEN_SECRET = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    this.ACCESS_TOKEN_SECRET = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );
  }

  async createAccessToken(user: User): Promise<string> {
    // Define payload for access token
    const payload = {
      sub: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };
    // Sign and return the access token with user information and expiration
    return this.jwtService.sign(payload, {
      secret: this.ACCESS_TOKEN_SECRET,
      expiresIn: '15d',
    });
  }

  async createRefreshToken(user: User): Promise<string> {
    // Delete all refresh tokens for the user
    await this.refreshTokenRepository.delete({ user: user });

    // Define payload for refresh token
    const refreshTokenPayload = { sub: user.id, email: user.email };
    // Sign the JWT refresh token
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.REFRESH_TOKEN_SECRET,
      expiresIn: '30d', // Set longer validity for refresh token
    });

    // Create new refresh token entity
    const refreshTokenEntity = this.refreshTokenRepository.create({
      user: user,
      token: refreshToken, // Store the JWT refresh token
      expiresIn: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    });

    // Save the new refresh token in the database
    await this.refreshTokenRepository.save(refreshTokenEntity);

    return refreshToken;
  }

  async validateToken(providedToken: string): Promise<User> {
    // Find the corresponding refresh token in the database
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: providedToken },
      relations: ['user'],
    });

    if (!refreshToken) {
      // Handle case where no corresponding refresh token is found
      throw new UnauthorizedException();
    }

    return refreshToken.user;
  }
}
