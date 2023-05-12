import { Product } from '../../products/entities/product.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Variant } from './variant.entity';
import { VariantValue } from './variant-values.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @ManyToOne(() => Variant)
  variant: Variant;

  @ManyToOne(() => VariantValue)
  variantValue: VariantValue;
}
