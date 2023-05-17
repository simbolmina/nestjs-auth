import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { ProductDto } from './product.dto';

export class GetProductsResponseDto {
  @ApiProperty({ type: [ProductDto] })
  data: ProductDto[];

  @ApiProperty({
    default: 30,
  })
  total: number;

  @ApiProperty({
    default: 1,
  })
  page: number;

  @ApiProperty({
    default: 10,
  })
  limit: number;

  @ApiProperty({
    default: 1,
  })
  pageCount: number;
}
