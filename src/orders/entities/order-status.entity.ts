import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orderStatus')
export class OrderStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // Other columns for the order status entity
}
