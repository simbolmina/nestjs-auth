import { Expose, Transform } from 'class-transformer';

export class ProductDto {
  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  categoryId: number;

  @Expose()
  brandId: number;

  @Expose()
  price: number;

  @Expose()
  salePrice: number;

  @Expose()
  quantity: number;

  @Expose()
  status: string;

  @Expose()
  tags: string[];

  @Expose()
  meta: string[];

  @Expose()
  isFeatured: boolean;

  @Expose()
  isOnSale: boolean;

  @Transform(({ obj }) => obj.seller.id)
  @Expose()
  sellerId: number;
}
