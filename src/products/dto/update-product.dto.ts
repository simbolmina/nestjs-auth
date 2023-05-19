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
import { Brand } from '../../brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';

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

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    example: '60a7b4b3-0b0a-4b4e-8b7a-5b0b2d7b0b2d',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  categoryId: Category;

  @ApiProperty({
    example: '60a7b4b3-0b0a-4b4e-8b7a-5b0b2d7b0b2d',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  brandId: Brand;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsOptional()
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
  @IsOptional()
  @IsBoolean()
  isFeatured: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isOnSale: boolean;
}
