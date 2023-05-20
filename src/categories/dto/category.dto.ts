import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    description: 'The unique identifier of the category.',
    example: 'c15fe0e4-e0e1-4107-93c9-b067b56e3b7f',
  })
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the category.',
    example: 'Category ABC',
  })
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The URL-friendly identifier of the category.',
    example: 'category-abc',
  })
  @IsNotEmpty()
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'The details of the category.',
    example: 'This is a description of Category ABC.',
  })
  @IsString()
  @Expose()
  details: string;

  @ApiProperty({
    description: 'The parent category id.',
    example: 'b15fe0e4-e0e1-4107-93c9-b067b56e3b7f',
  })
  @IsOptional()
  @IsUUID()
  @Expose()
  parentId: string;

  @ApiProperty({
    description: 'The ids of the sub-categories.',
    example: [
      'd15fe0e4-e0e1-4107-93c9-b067b56e3b7f',
      'e15fe0e4-e0e1-4107-93c9-b067b56e3b7f',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @Expose()
  subCategoryIds: string[];

  @ApiProperty({
    description: 'The date when the category was created',
    example: '2023-05-20T22:00:00Z',
  })
  @IsDateString()
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the category was last updated',
    example: '2023-05-21T22:00:00Z',
  })
  @IsDateString()
  @Expose()
  updatedAt: Date;
}
