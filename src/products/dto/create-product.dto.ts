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
} from 'class-validator';

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
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  brandId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @IsLessThan('price')
  salePrice: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  meta: string[];

  @IsNotEmpty()
  @IsBoolean()
  isFeatured: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isOnSale: boolean;
}
