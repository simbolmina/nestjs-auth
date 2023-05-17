import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
  IsEnum,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
  IsUUID,
} from 'class-validator';
import { Brand } from 'src/brands/entities/brand.entity';
import { Category } from 'src/categories/entities/category.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

enum ProductStatus {
  Draft = 'draft',
  Selling = 'selling',
  Sold = 'sold',
  Pending = 'pending',
  Rejected = 'rejected',
  Approved = 'approved',
  Deleted = 'deleted',
}

function IsLessThan(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsLessThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'number' &&
            typeof relatedValue === 'number' &&
            value < relatedValue
          );
        },
        defaultMessage(args: ValidationArguments) {
          return 'Sale price should be lower than price';
        },
      },
    });
  };
}

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  categoryId: Category;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  brandId: Brand;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsLessThan('price')
  salePrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  meta: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isFeatured: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isOnSale: boolean;
}
