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
} from 'class-validator';

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
}

export class AdminUpdateUserDto extends UpdateUserDto {
  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
    enum: ['user', 'manager', 'admin'],
    required: false,
  })
  @IsEnum(
    { user: 'user', manager: 'manager', admin: 'admin' },
    { message: 'Role must be either user, manager, or admin' },
  )
  @IsOptional()
  role?: string;
}
