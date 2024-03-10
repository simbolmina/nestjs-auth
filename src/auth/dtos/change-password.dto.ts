import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({
    description: 'Old password of the user',
    example: '123456',
  })
  oldPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({
    description: 'new password of the user',
    example: 'abcdefg',
  })
  newPassword: string;
}
