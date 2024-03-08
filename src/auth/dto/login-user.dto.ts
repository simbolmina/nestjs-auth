import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'example@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'StrongPass0rd!',
    minLength: 8,
  })
  @IsStrongPassword()
  password: string;
}
