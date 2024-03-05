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
    example: 'example@email.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The status of the user',
    example: 'active',
    enum: [
      'pending',
      'active',
      'inactive',
      'blocked',
      'soft_deleted',
      'deleted',
    ],
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
    enum: ['user', 'manager', 'admin'],
  })
  @Expose()
  role: string;

  @ApiProperty({
    description: 'The date when the user was created',
    example: '2023-05-09T08:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the user was last updated',
    example: '2023-06-01T08:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  // Assuming you still want to expose the picture if you are keeping it in some form
  @ApiProperty({
    description: 'The profile picture of the user',
    example: '/assets/profile.jpg', // Changed example to a more common image path
  })
  @Expose()
  picture: string;
}
