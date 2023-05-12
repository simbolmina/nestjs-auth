import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Variant } from './variant.entity';

@Entity('variantValues')
export class VariantValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  // Define other columns for the variant value entity

  @ManyToOne(() => Variant, (variant) => variant.values)
  variant: Variant;
}
