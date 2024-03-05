import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateMeDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'example@email.com',
    required: false,
  })
  @IsEmail()
  email?: string;
}
