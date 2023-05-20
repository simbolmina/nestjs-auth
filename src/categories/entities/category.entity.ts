import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import slugify from 'slugify';
import { Product } from '../../products/entities/product.entity';
import { Attachment } from '../../attachments/entities/attachment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

@Entity('categories')
export class Category {
  @ApiProperty({ description: 'The unique identifier of the category.' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The name of the category.' })
  @IsNotEmpty({ message: 'Category name must not be empty.' })
  @MaxLength(255, { message: 'Category name must not exceed 255 characters.' })
  @Column({ length: 255, nullable: true })
  name: string;

  @ApiProperty({ description: 'The URL-friendly identifier of the category.' })
  @Column({ length: 255, nullable: true })
  slug: string;

  @ApiProperty({ description: 'The details of the category.' })
  @MaxLength(255, {
    message: 'Category details must not exceed 255 characters.',
  })
  @Column({ length: 255, nullable: true })
  details: string;

  @ApiProperty({ description: 'The parent category.' })
  @ManyToOne(() => Category, (category) => category.subCategories, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  parent: Category;

  @ApiProperty({ description: 'The sub-categories.' })
  @OneToMany(() => Category, (category) => category.parent)
  subCategories: Category[];

  @ApiProperty({ description: 'The products in the category.' })
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @ApiProperty({ description: 'Attachments related to the category.' })
  @ManyToMany(() => Attachment, { cascade: true })
  @JoinTable({
    name: 'categoryAttachments',
  })
  attachments: Attachment[];

  @ApiProperty({ description: 'The date when the cateogry was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the category was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'The date when the category was deleted',
    required: false,
  })
  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true });
  }
}
