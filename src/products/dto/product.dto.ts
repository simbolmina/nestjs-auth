import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export class ProductDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  description: string;

  @Transform(({ obj }) => (obj.category ? obj.category : undefined))
  @ApiProperty({ type: () => CreateCategoryDto })
  @Expose()
  category: string;

  @Transform(({ obj }) => (obj.brand ? obj.brand.id : undefined))
  @ApiProperty()
  @Expose()
  brandId: string;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  salePrice: number;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  tags: string[];

  @ApiProperty()
  @Expose()
  meta: string[];

  @ApiProperty()
  @Expose()
  isFeatured: boolean;

  @ApiProperty()
  @Expose()
  isOnSale: boolean;

  @Transform(({ obj }) => (obj.seller ? obj.seller.id : undefined))
  @ApiProperty()
  @Expose()
  sellerId: string;
}
