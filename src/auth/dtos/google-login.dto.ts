import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({
    description: 'The Google ID token from the client',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6I...',
  })
  @IsString()
  credential: string;

  @ApiProperty({
    description: 'The Client ID from the Google Developer Console',
    example: '32555940559.apps.googleusercontent.com',
  })
  @IsString()
  clientId: string;
}
