import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('paymentMethods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // Other columns for the payment method entity
}
