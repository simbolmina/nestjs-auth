import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Current refresh token of the user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGFlNzRjZTU1ZjMxNjI2ZmQ1YmE4YzAiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwiaWF0IjoxNjg5NTc4MDUzLCJleHAiOjE2ODk5MzgwNTN9.04rx2NHdSS4kovTnRjgEs9VWUC6rVulVdnVFjBFcM88.tIiwiaWF0IjoxNjg5NTc4MDUzLCJleHAiOjE2ODk5MzgwNTN9',
  })
  @IsString()
  refreshToken: string;
}
