import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category.',
    example: 'woman',
  })
  @IsNotEmpty({ message: 'Category name must not be empty.' })
  name: string;

  @ApiProperty({
    description: 'The details of the category.',
    example: 'This cateogry includes women clothing.',
    required: false,
  })
  @IsOptional()
  details: string;

  @ApiProperty({
    description: 'The ID of the parent category.',
    example: 'f15fe0e4-e0e1-4107-93c9-b067b56e3b7e',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  parentId: string;
}
