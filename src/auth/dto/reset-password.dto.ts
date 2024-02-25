import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The reset token for password reset.' })
  resetToken: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({ description: 'The new password for the user.' })
  newPassword: string;
}
