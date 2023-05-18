import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({
    description: 'Old password of the user',
    example: '123456',
  })
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({
    description: 'new password of the user',
    example: 'abcdefg',
  })
  // The following regex will enforce these rules:
  // - At least one upper case English letter
  // - At least one lower case English letter
  // - At least one digit
  // - At least one special character
  // - At least 8 in length
  // - Max 20 in length
  //   @Matches(
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/,
  //     { message: 'password too weak' },
  //   )
  newPassword: string;
}
