import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  tokenVersion: number;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  passwordResetCode: string;

  @IsOptional()
  @IsNumber()
  passwordResetExpires: Date;

  @ApiProperty({
    example: true,
    description: 'Flag to indicate if the email has been verified',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  // @Transform(({ value }) => parseBoolean(value), { toClassOnly: true })
  emailVerified?: boolean;

  @ApiProperty({
    example: true,
    description: 'Flag to indicate if user had activated 2fa verification',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  // @Transform(({ value }) => parseBoolean(value), { toClassOnly: true })
  is2FAEnabled: boolean;

  @ApiProperty({
    example: '1234',
    description: 'The OTP code for email verification',
    required: false,
  })
  @IsOptional()
  @IsString()
  otp?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'The expiry date for the OTP',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  otpExpiry?: number;

  @ApiProperty({
    description: 'Firebase Cloud Messaging token of user',
    required: false,
  })
  @IsOptional()
  @IsString()
  fcmToken?: string;
}

export class AdminUpdateUserDto extends UpdateUserDto {
  @ApiProperty({
    description: 'The mail of the user',
    example: 'example@email.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
    enum: ['user', 'manager', 'admin'],
    required: false,
  })
  @IsEnum(['user', 'manager', 'admin'])
  @IsOptional()
  role?: string;

  @ApiProperty({
    description: 'Shows if user is vip or not',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVIP?: boolean;
}
