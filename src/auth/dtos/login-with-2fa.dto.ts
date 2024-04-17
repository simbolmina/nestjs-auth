import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginWithTwoFactorAuthenticationDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The OTP code sent to the user.' })
  otp: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The OTP code sent to the user.' })
  tempAuthToken: string;
}
