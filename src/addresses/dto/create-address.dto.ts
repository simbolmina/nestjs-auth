import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'Home', description: 'The title or label for the address' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'John', description: 'First name of the recipient' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the recipient' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: '123-456-7890', description: 'Contact phone number' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'New York', description: 'City of the address' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'Manhattan', description: 'District of the address' })
  @IsNotEmpty()
  @IsString()
  district: string;

  @ApiProperty({ example: 'Upper East Side', description: 'Neighborhood of the address' })
  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @ApiProperty({ example: 'Apartment 5A, near the central park', description: 'Detailed address information' })
  @IsNotEmpty()
  @IsString()
  details: string;

  @ApiProperty({ example: '10021', description: 'Postal code of the address' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(5)
  postalCode: string;

}
