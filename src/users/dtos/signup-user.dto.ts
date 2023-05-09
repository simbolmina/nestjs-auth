import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserDto } from './user.dto';

export class SignupUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
    minLength: 5,
  })
  @IsString()
  @MinLength(5, { message: 'Password should be at least 8 characters long' })
  password: string;
}

export class UserSignupResponseDto {
  @ApiProperty({ type: () => UserDto })
  user: UserDto;

  @ApiProperty()
  token: string;
}
