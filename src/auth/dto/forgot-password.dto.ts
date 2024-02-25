import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email address of the user.',
    example: 'example@email.com',
  })
  email: string;
}
