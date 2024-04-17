import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsNotEmpty,
  IsStrongPassword,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { UserRoles } from '../entities/user.entity';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'example@email.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  tokenVersion: number;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  passwordResetCode: string;

  @IsOptional()
  @IsDate()
  passwordResetExpires: Date;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  twoFactorAuthToken: string;

  @IsOptional()
  @IsDate()
  twoFactorAuthTokenExpiry: Date;

  @IsOptional()
  @IsBoolean()
  isTwoFactorAuthEnabled: boolean;
}

export class AdminUpdateUserDto extends UpdateUserDto {
  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
    enum: UserRoles,
    required: false,
  })
  @IsEnum(UserRoles, { message: 'Role must be either user, manager, or admin' })
  @IsOptional()
  role?: UserRoles;
}
