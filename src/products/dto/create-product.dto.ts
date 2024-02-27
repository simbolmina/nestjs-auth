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
  @ApiProperty({
    example: '60a7b4b3-0b0a-4b4e-8b7a-5b0b2d7b0b2d',
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string; // Change to string or UUID

  @ApiProperty({
    example: '60a7b4b3-0b0a-4b4e-8b7a-5b0b2d7b0b2d',
  })
  @IsNotEmpty()
  @IsUUID()
  brandId: string; // Change to string or UUID

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsLessThan('price')
  discountPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  quality: string;

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
