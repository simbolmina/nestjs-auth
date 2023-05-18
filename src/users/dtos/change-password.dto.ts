import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
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
