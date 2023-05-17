import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class GetProductsDto {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}
