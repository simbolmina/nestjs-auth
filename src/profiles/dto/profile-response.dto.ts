import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProfileResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  firstName: string;

  @Expose()
  @ApiProperty()
  lastName: string;

  @Expose()
  @ApiProperty()
  phoneNumber: string;

  @Expose()
  @ApiProperty()
  userId: string;

  @Expose()
  @ApiProperty()
  displayName: string;

  @Expose()
  @ApiProperty()
  picture: string;

  @Expose()
  @ApiProperty()
  birthDate: Date;

  @Expose()
  @ApiProperty()
  gender: string;

  @Expose()
  @ApiProperty()
  bio: string;

  @Expose()
  @ApiProperty()
  ratingsAverage: number;

  @Expose()
  @ApiProperty()
  ratingsQuantity: number;
}
