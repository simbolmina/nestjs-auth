import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'The id of the user',
    example: '02302d6e-4eea-403d-a466-6ba902b004fb',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The display name of the user',
    example: 'JohnDoe',
  })
  @Expose()
  displayName: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'The bio of the user',
    example: 'Lorem ipsum dolor sit amet...',
  })
  @Expose()
  bio: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    description: 'The profile picture of the user',
    example: '/assets/placeholder/instagram.svg',
  })
  @Expose()
  picture: string;

  @ApiProperty({
    description: 'The last active date of the user',
    example: '2023-05-09T08:00:00.000Z',
  })
  @Expose()
  lastActive: Date;

  @ApiProperty({
    description: 'The birth date of the user',
    example: '1990-01-01',
  })
  @Expose()
  birthDate: Date;

  @ApiProperty({
    description: 'The gender of the user',
    example: 'other',
    enum: ['male', 'female', 'other'],
  })
  @Expose()
  gender: string;

  @ApiProperty({
    description: 'The average rating of the user',
    example: 0,
  })
  @Expose()
  ratingsAverage: number;

  @ApiProperty({
    description: 'The total number of ratings for the user',
    example: 0,
  })
  @Expose()
  ratingsQuantity: number;

  @ApiProperty({
    description: 'Indicates if the user is a VIP',
    example: false,
  })
  @Expose()
  isVIP: boolean;

  @ApiProperty({
    description: 'The date when the user was created',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the user was last updated',
  })
  @Expose()
  updatedAt: Date;
}
