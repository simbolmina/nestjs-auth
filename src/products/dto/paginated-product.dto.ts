import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from 'src/common/dto/meta.dto';
import { GetProductsDto } from './get-product.dto';

export class PaginatedProductDto {
  @ApiProperty({ type: MetaDto })
  meta: MetaDto;

  @ApiProperty({ type: [GetProductsDto] })
  data: GetProductsDto[];
}
