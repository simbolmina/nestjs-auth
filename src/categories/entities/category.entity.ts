import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.sub_categories, {
    onDelete: 'CASCADE',
  })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  sub_categories: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
