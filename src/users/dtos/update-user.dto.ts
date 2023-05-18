import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The display name of the user',
    example: 'JohnDoe',
    required: false,
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'The bio of the user',
    example: 'Lorem ipsum dolor sit amet...',
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'The birth date of the user',
    example: '1990-01-01',
    required: false,
  })
  @IsString()
  @IsOptional()
  birthDate?: Date;

  @ApiProperty({
    description: 'The gender of the user',
    example: 'other',
    enum: ['male', 'female', 'other'],
    required: false,
  })
  @IsEnum(['male', 'female', 'other'])
  @IsOptional()
  gender?: string;
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
