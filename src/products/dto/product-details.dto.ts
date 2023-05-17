import { ApiProperty } from '@nestjs/swagger';

class SellerDto {
  @ApiProperty({ description: 'Display name of the seller' })
  displayName: string;
}

class CategoryDto {
  @ApiProperty({ description: 'Name of the category' })
  name: string;
}

class BrandDto {
  @ApiProperty({ description: 'Name of the brand' })
  name: string;
}

export class ProductDetailsDto {
  @ApiProperty({ description: 'Product ID' })
  id: string;

  @ApiProperty({ description: 'Product name' })
  name: string;

  @ApiProperty({ description: 'Product slug' })
  slug: string;

  @ApiProperty({ description: 'Product description' })
  description: string;

  @ApiProperty({ description: 'Product price' })
  price: string;

  @ApiProperty({ description: 'Product sale price' })
  salePrice: string;

  @ApiProperty({ description: 'Product quantity' })
  quantity: number;

  @ApiProperty({ description: 'Product status' })
  status: string;

  @ApiProperty({ description: 'Product tags' })
  tags: string[];

  @ApiProperty({ description: 'Product meta' })
  meta: any;

  @ApiProperty({ description: 'Product is featured' })
  isFeatured: boolean;

  @ApiProperty({ description: 'Product is on sale' })
  isOnSale: boolean;

  @ApiProperty({ description: 'Product seller', type: SellerDto })
  seller: SellerDto;

  @ApiProperty({ description: 'Product category', type: CategoryDto })
  category: CategoryDto;

  @ApiProperty({ description: 'Product brand', type: BrandDto })
  brand: BrandDto;
}
