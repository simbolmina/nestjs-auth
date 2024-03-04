import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { Logger } from '@nestjs/common';
import { RefreshToken } from './entities/refresh-token.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

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
    this.REFRESH_TOKEN_SECRET = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    this.ACCESS_TOKEN_SECRET = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };
    return this.jwtService.sign(payload, {
      secret: this.ACCESS_TOKEN_SECRET,
      expiresIn: '30m', // Adjust the expiration as needed
    });
  }

  async createRefreshToken(user: User) {
    // Delete all existing refresh tokens for the user
    await this.refreshTokenRepository.delete({ user: user });

    const refreshTokenPayload = { sub: user.id };
    const jwtPart = this.jwtService.sign(refreshTokenPayload, {
      secret: this.REFRESH_TOKEN_SECRET,
      expiresIn: '90d', // Set your desired expiration
    });

    const uniqueTokenIdentifier = randomBytes(16).toString('hex');
    const hash = (await scryptAsync(
      uniqueTokenIdentifier,
      this.REFRESH_TOKEN_SECRET,
      64,
    )) as Buffer;

    const refreshToken = this.refreshTokenRepository.create({
      user: user,
      token: hash.toString('hex'),
      expiresIn: Date.now() + 90 * 24 * 60 * 60 * 1000, // Expires in 90 days
    });

    await this.refreshTokenRepository.save(refreshToken);

    const combinedToken = `${jwtPart}.${uniqueTokenIdentifier}`;

    return combinedToken;
  }

  async validateToken(providedToken: string): Promise<RefreshToken> {
    const parts = providedToken.split('.');
    if (parts.length !== 4) {
      throw new UnauthorizedException('Invalid token format.');
    }

    // Combine the first three parts to form the complete JWT
    const jwtPart = `${parts[0]}.${parts[1]}.${parts[2]}`;
    let payload;
    try {
      payload = this.jwtService.verify(jwtPart, {
        secret: this.REFRESH_TOKEN_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    const uniqueTokenIdentifier = parts[3]; // The plain unique token identifier
    const hash = (await scryptAsync(
      uniqueTokenIdentifier,
      this.REFRESH_TOKEN_SECRET,
      64,
    )) as Buffer;

    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: hash.toString('hex') },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException('No valid token found.');
    }

    return refreshToken;
  }

  async refreshToken(oldRefreshToken: string) {
    // Validate the provided refresh token
    const refreshToken = await this.validateToken(oldRefreshToken);

    // Delete the old refresh token
    // await this.refreshTokenRepository.remove(refreshToken);

    // Generate new tokens
    const user = await this.usersService.findOneById(refreshToken.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newAccessToken = await this.createAccessToken(user);
    const newRefreshToken = await this.createRefreshToken(user);

    const loginResponse: any = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };

    return loginResponse;
  }
}
