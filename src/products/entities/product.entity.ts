import { Brand } from 'src/brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { Attachment } from '../../attachments/entities/attachment.entity';
import { Variant } from '../../variants/entities/variant.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsArray,
  IsPositive,
  ArrayNotEmpty,
  ArrayMaxSize,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
const slugify = require('slugify');

@Entity('products')
@Index('products_slug_idx', ['slug'], { unique: true })
@Index('products_name_idx', ['name'])
export class Product {
  @ApiProperty({ description: 'The unique identifier of the product.' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the product.' })
  @IsNotEmpty({ message: 'Product name must not be empty.' })
  @MaxLength(200, { message: 'Product name must not exceed 200 characters.' })
  @Column({ nullable: false })
  name: string;

  //relations start
  @ManyToOne(() => User, (user) => user.products)
  @ApiProperty({ description: 'The seller of the product.' })
  seller: User;

  @ManyToOne(() => Category, (category) => category.products)
  @ApiProperty({ description: 'The category of the product.' })
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @ApiProperty({ description: 'The brand of the product.' })
  brand: Brand;

  @ManyToMany(() => Attachment, (attachment) => attachment.products)
  @JoinTable({ name: 'productAttachments' })
  @ApiProperty({ description: 'Attachments related to the product.' })
  attachments: Attachment[];

  @ManyToMany(() => Variant)
  @JoinTable({ name: 'productVariants' })
  @ApiProperty({ description: 'Variants of the product.' })
  variants: Variant[];
  //relations end

  @ApiProperty({ description: 'The URL-friendly identifier of the product.' })
  @IsNotEmpty({ message: 'Slug must not be empty.' })
  @Column({ unique: true, nullable: false })
  slug: string;

  @ApiProperty({ description: 'The detailed description of the product.' })
  @IsOptional()
  @MaxLength(5000, {
    message: 'Product description must not exceed 5000 characters.',
  })
  @Column({ nullable: true, type: 'text' })
  description: string;

  @ApiProperty({ description: 'The price of the product.' })
  @IsNumber()
  @Min(0, { message: 'Product price must be a positive number.' })
  @Column({ nullable: true, type: 'decimal' })
  price: number;

  @ApiProperty({ description: 'The sale price of the product.' })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Sale price must be a positive number.' })
  @Column({ nullable: true, type: 'decimal' })
  salePrice: number;

  @ApiProperty({ description: 'The quantity of the product.' })
  @IsNumber()
  @IsPositive({ message: 'Quantity must be a positive number.' })
  @Column({ nullable: true, default: 1 })
  quantity: number;

  @ApiProperty({ description: 'The status of the product.' })
  @IsEnum([
    'draft',
    'selling',
    'sold',
    'pending',
    'rejected',
    'approved',
    'deleted',
  ])
  @Column({
    nullable: true,
    type: 'enum',
    enum: [
      'draft',
      'selling',
      'sold',
      'pending',
      'rejected',
      'approved',
      'deleted',
    ],
    default: 'draft',
  })
  status: string;
  @ApiProperty({ description: 'The tags associated with the product.' })
  @IsArray()
  @ArrayNotEmpty({ message: 'Tags must not be empty.' })
  @ArrayMaxSize(10, { message: 'Cannot have more than 10 tags.' })
  @Column({ nullable: true, type: 'json' })
  tags: string[];

  @ApiProperty({ description: 'The meta data of the product.' })
  @IsArray()
  @ArrayNotEmpty({ message: 'Meta data must not be empty.' })
  @Column({ nullable: true, type: 'json' })
  meta: string[];

  @ApiProperty({ description: 'Flag to mark product as featured.' })
  @IsBoolean()
  @Column({ nullable: true, default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Flag to mark product as on sale.' })
  @IsBoolean()
  @Column({ nullable: true, default: false })
  isOnSale: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
}
