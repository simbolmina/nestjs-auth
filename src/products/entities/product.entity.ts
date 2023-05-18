import { Brand } from '../../brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Attachment } from '../../attachments/entities/attachment.entity';
import { Variant } from '../../variants/entities/variant.entity';
const slugify = require('slugify');

@Entity('products')
@Index('products_slug_key', ['slug'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  //relations start
  @ManyToOne(() => User, (user) => user.products)
  seller: User;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @ManyToMany(() => Attachment, (attachment) => attachment.products)
  @JoinTable({
    name: 'productAttachments',
  })
  attachments: Attachment[];

  @ManyToMany(() => Variant)
  @JoinTable({
    name: 'productVariants',
  })
  variants: Variant[];
  //relations end

  @Column({ unique: true, nullable: false })
  slug: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'decimal' })
  price: number;

  @Column({ nullable: true, type: 'decimal' })
  salePrice: number;

  @Column({ nullable: true, default: 1 })
  quantity: number;

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

  @Column({ nullable: true, type: 'json' })
  tags: string[];

  @Column({ nullable: true, type: 'json' })
  meta: string[];

  @Column({ nullable: true, default: false })
  isFeatured: boolean;

  @Column({ nullable: true, default: false })
  isOnSale: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
}
