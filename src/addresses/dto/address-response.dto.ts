import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AddressResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  firstName: string;

  @Expose()
  @ApiProperty()
  lastName: string;

  @Expose()
  @ApiProperty()
  phone: string;

  @Expose()
  @ApiProperty()
  city: string;

  @Expose()
  @ApiProperty()
  district: string;

  @Expose()
  @ApiProperty()
  neighborhood: string;

  @Expose()
  @ApiProperty()
  details: string;

  @Expose()
  @ApiProperty()
  postalCode: string;

  @Expose()
  @ApiProperty()
  userId: string; // Only include the user ID or other non-sensitive info
}
