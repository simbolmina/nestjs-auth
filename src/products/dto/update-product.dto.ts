import { ApiProperty, PartialType } from '@nestjs/swagger';
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
import { CreateProductDto } from './create-product.dto';

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

export class UpdateProductDto extends PartialType(CreateProductDto) {}
