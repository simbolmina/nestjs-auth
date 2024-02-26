import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { VariantValue } from './variant-values.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity('variants')
export class Variant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => VariantValue, (variantValue) => variantValue.variant, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  values: VariantValue[];

  @ManyToMany(() => Category, (category) => category.variants)
  categories: Category[];
}
