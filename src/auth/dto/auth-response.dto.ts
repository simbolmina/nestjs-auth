import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGFlNzRjZTU1ZjMxNjI2ZmQ1YmE4YzAiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwiaWF0IjoxNjg5NTc4MDUzLCJleHAiOjE2ODk5MzgwNTN9.04rx2NHdSS4kovTnRjgEs9VWUC6rVulVdnVFjBFcM88',
    description: 'The authentication token',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGFlNzRjZTU1ZjMxNjI2ZmQ1YmE4YzAiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwiaWF0IjoxNjg5NTc4MDUzLCJleHAiOjE2ODk5MzgwNTN9.04rx2NHdSS4kovTnRjgEs9VWUC6rVulVdnVFjBFcM88.tIiwiaWF0IjoxNjg5NTc4MDUzLCJleHAiOjE2ODk5MzgwNTN9',
    description: 'The refresh token',
  })
  refreshToken: string;
}
