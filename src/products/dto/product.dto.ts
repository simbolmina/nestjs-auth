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
} from 'class-validator';
import { Brand } from 'src/brands/entities/brand.entity';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';

export class ProductDto {
  @ApiProperty({
    description: 'The unique identifier of the product.',
    example: 'f15fe0e4-e0e1-4107-93c9-b067b56e3b7e',
  })
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the product.',
    example: 'Product ABC',
  })
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The slug of the product.',
    example: 'product-abc',
  })
  @IsNotEmpty()
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'The description of the product.',
    example: 'This is a description of Product ABC.',
  })
  @IsString()
  @Expose()
  description: string;

  @ApiProperty({
    description: 'The price of the product.',
    example: 59.99,
  })
  @IsNumber()
  @Expose()
  price: number;

  @ApiProperty({
    description: 'The sale price of the product.',
    example: 49.99,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  salePrice: number;

  @ApiProperty({
    description: 'The quantity of the product in stock.',
    example: 100,
  })
  @IsNumber()
  @Expose()
  quantity: number;

  @ApiProperty({
    description: 'The status of the product.',
    example: 'selling',
  })
  @IsString()
  @Expose()
  status: string;

  @ApiProperty({
    description: 'The tags associated with the product.',
    example: ['tag1', 'tag2'],
  })
  @IsArray()
  @Expose()
  tags: string[];

  @ApiProperty({
    description: 'The meta data associated with the product.',
    example: ['meta1', 'meta2'],
  })
  @IsArray()
  @Expose()
  meta: string[];

  @ApiProperty({
    description: 'Whether the product is featured or not.',
    example: true,
  })
  @IsBoolean()
  @Expose()
  isFeatured: boolean;

  @ApiProperty({
    description: 'Whether the product is on sale or not.',
    example: true,
  })
  @IsBoolean()
  @Expose()
  isOnSale: boolean;
}
