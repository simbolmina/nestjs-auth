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

export class UpdateUserDto {}

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
