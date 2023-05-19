import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';
import { Expose, Transform, Type } from 'class-transformer';
import { IsUUID, IsNotEmpty } from 'class-validator';

class SellerDto {
  @ApiProperty({ description: 'Display name of the seller' })
  @IsNotEmpty()
  @Expose()
  displayName: string;

  @Transform(({ obj }) => obj.id)
  @ApiProperty({
    description: 'The id of the seller.',
    example: 'a13be1e4-a431-4c33-9a2c-9937b67a5f71',
  })
  @IsUUID()
  @Expose()
  sellerId: string;
}

class CategoryDto {
  @ApiProperty({ description: 'Name of the category' })
  @IsNotEmpty()
  @Expose()
  name: string;

  @Transform(({ obj }) => obj.id)
  @ApiProperty({
    description: 'The id of the category.',
    example: 'a13be1e4-a431-4c33-9a2c-9937b67a5f71',
  })
  @IsUUID()
  @Expose()
  categoryId: string;
}

class BrandDto {
  @ApiProperty({ description: 'Name of the brand' })
  @IsNotEmpty()
  @Expose()
  name: string;

  @Transform(({ obj }) => obj.id)
  @ApiProperty({
    description: 'The brand id of the product.',
    example: 'a13be1e4-a431-4c33-9a2c-9937b67a5f71',
  })
  @IsUUID()
  @Expose()
  brandId: string;
}

export class ProductDetailsDto extends ProductDto {
  @ApiProperty({ description: 'Product seller', type: SellerDto })
  @Expose()
  @Type(() => SellerDto)
  seller: SellerDto;

  @ApiProperty({ description: 'Product category', type: CategoryDto })
  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @ApiProperty({ description: 'Product brand', type: BrandDto })
  @Expose()
  @Type(() => BrandDto)
  brand: BrandDto;
}
