import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserDto } from './user.dto';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'example@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: '123456',
    minLength: 5,
  })
  @IsString()
  @MinLength(5, { message: 'Password should be at least 8 characters long' })
  password: string;
}

export class UserLoginResponseDto {
  @ApiProperty({ type: () => UserDto })
  data: UserDto;

  @ApiProperty({
    description: 'The JWT token to include in the header of future requests',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NTEwMGUzZi0xMmYxLTQxN2UtYjg4ZC04NTJmN2QwZTAxOGYiLCJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsImlhdCI6MTY4NDQxMDc1OCwiZXhwIjoxNjkyMTg2NzU4fQ.yy5gvPs6QB7bQWabZaaugYrNYeR6IVDN-OYpI_i0Pus',
  })
  token: string;
}
