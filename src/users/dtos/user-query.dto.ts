import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsIn,
  IsArray,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';
import { SortOrder } from 'src/common/enums';
import { UserStatus } from '../entities/user.entity';

export class UsersQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserStatus)
  @Type(() => String)
  @IsString({ each: true })
  status?: string | string[];

  @ApiPropertyOptional()
  @IsOptional()
  query?: string;

  @ApiPropertyOptional()
  @IsOptional()
  // @IsIn(['role', 'createdAt'])
  sortBy?: string;

  @ApiPropertyOptional({ enum: SortOrder })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder: SortOrder = SortOrder.ASC;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 10;
}
