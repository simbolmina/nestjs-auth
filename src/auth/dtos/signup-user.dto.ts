import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignupUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'example@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'StrongPassw0rd!',
    minLength: 5,
  })
  @IsStrongPassword()
  password: string;
}
