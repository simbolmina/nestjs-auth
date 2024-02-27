import { ApiProperty } from '@nestjs/swagger';

export class MetaDto {
  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  pageSize: number;

  @ApiProperty({ description: 'Total number of items' })
  totalItems: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
