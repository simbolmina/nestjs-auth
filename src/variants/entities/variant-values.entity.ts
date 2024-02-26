import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Variant } from './variant.entity';

@Entity('variantValues')
export class VariantValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @ManyToOne(() => Variant, (variant) => variant.values)
  @JoinColumn({ name: 'variant_id' }) // This line is optional if you're using default naming conventions
  variant: Variant;
}
