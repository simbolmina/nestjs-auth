import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  Min,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

enum ProductStatus {
  Draft = 'draft',
  Selling = 'selling',
  Sold = 'sold',
  Pending = 'pending',
  Rejected = 'rejected',
  Approved = 'approved',
  Deleted = 'deleted',
}

function toBoolean(value: any): boolean {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return Boolean(value);
}

export class GetFeaturedProductdDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: string;

  @Transform(({ value }) => toBoolean(value))
  @IsNotEmpty()
  @IsBoolean()
  isFeatured: boolean;

  // @Transform(({ value }) => parseInt(value))
  // @IsNumber()
  // @Min(0)
  // minPrice: number;

  // @Transform(({ value }) => parseInt(value))
  // @IsNumber()
  // @Min(0)
  // maxPrice: number;

  @IsNotEmpty()
  @IsString()
  order: 'ASC' | 'DESC';
}
