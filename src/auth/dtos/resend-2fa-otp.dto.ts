import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Resend2faOtpDto {
  @ApiProperty()
  @IsString()
  tempAuthToken: string;
}
