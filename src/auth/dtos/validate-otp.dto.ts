import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateOtpDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The OTP code sent to the user.' })
  otp: string;
}
