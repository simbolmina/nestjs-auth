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
      expiresIn: '15m',
    });
  }

  async createRefreshToken(user: User): Promise<string> {
    // Remove all existing refresh tokens for this user to ensure they can only use one at a time
    await this.refreshTokenRepository.delete({ user: user });

    // Define payload for refresh token
    const refreshTokenPayload = { sub: user.id };
    // Sign the JWT part of the refresh token
    const jwtPart = this.jwtService.sign(refreshTokenPayload, {
      secret: this.REFRESH_TOKEN_SECRET,
      expiresIn: '30d', // Set longer validity for refresh token
    });

    // Generate a unique identifier for the refresh token
    const uniqueTokenIdentifier = randomBytes(16).toString('hex');
    // Hash the identifier to store securely in the database
    const hash = (await scryptAsync(
      uniqueTokenIdentifier,
      this.REFRESH_TOKEN_SECRET,
      64,
    )) as Buffer;

    // Create new refresh token entity
    const refreshToken = this.refreshTokenRepository.create({
      user: user,
      token: hash.toString('hex'), // Store hashed version for security
      expiresIn: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    });

    // Save the new refresh token in the database
    await this.refreshTokenRepository.save(refreshToken);

    // Return the combined token (JWT part + unique identifier)
    const combinedToken = `${jwtPart}.${uniqueTokenIdentifier}`;
    return combinedToken;
  }

  async validateToken(providedToken: string): Promise<RefreshToken> {
    // Split the provided token to extract the JWT part and the unique identifier
    const parts = providedToken.split('.');
    if (parts.length !== 4) {
      // Ensure the token has the correct format
      throw new UnauthorizedException('Invalid token format.');
    }

    // Reconstruct the JWT part from the split token
    const jwtPart = `${parts[0]}.${parts[1]}.${parts[2]}`;
    let payload;
    try {
      // Verify the JWT part using the refresh token secret
      payload = this.jwtService.verify(jwtPart, {
        secret: this.REFRESH_TOKEN_SECRET,
      });
    } catch (error) {
      // Handle invalid or expired JWT
      throw new UnauthorizedException('Invalid or expired token.');
    }

    // Extract the unique identifier and hash it
    const uniqueTokenIdentifier = parts[3];
    const hash = (await scryptAsync(
      uniqueTokenIdentifier,
      this.REFRESH_TOKEN_SECRET,
      64,
    )) as Buffer;

    // Find the corresponding refresh token in the database
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: hash.toString('hex') },
      relations: ['user'],
    });

    if (!refreshToken) {
      // Handle case where no corresponding refresh token is found
      throw new UnauthorizedException('No valid token found.');
    }

    // Return the found refresh token
    return refreshToken;
  }

  async refreshToken(
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Validate the old refresh token
    const refreshTokenEntity = await this.validateToken(oldRefreshToken);

    // Find the user associated with the refresh token
    const user = await this.usersService.findOneById(
      refreshTokenEntity.user.id,
    );
    if (!user) {
      // Handle case where user no longer exists
      throw new NotFoundException('User not found');
    }

    // Generate new access and refresh tokens for the user
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    // Return the new tokens
    return {
      accessToken,
      refreshToken,
    };
  }
}
