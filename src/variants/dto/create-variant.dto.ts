import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateVariantValueDto {
  @ApiProperty({ description: 'The value of the variant.' })
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class CreateVariantDto {
  @ApiProperty({ description: 'The name of the variant, e.g., Color, Size.' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description:
      'Optional list of variant values to be created along with the variant.',
    type: [CreateVariantValueDto],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantValueDto)
  values?: CreateVariantValueDto[];

  @ApiProperty({
    description:
      'Optional list of category IDs that this variant is applicable to.',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  categoryIds?: string[];
}
