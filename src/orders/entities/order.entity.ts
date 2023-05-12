import { Address } from 'src/addresses/entities/address.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { OrderStatus } from './order-status.entity';
import { PaymentMethod } from './payment-method.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Other columns for the order entity

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  @OneToOne(() => OrderStatus)
  @JoinColumn({ name: 'statusId' })
  status: OrderStatus;

  @OneToOne(() => PaymentMethod)
  @JoinColumn({ name: 'paymentMethodId' })
  paymentMethod: PaymentMethod;

  @OneToOne(() => Address)
  @JoinColumn({ name: 'shippedAddressId' })
  shippedAddress: Address;

  @OneToOne(() => Address)
  @JoinColumn({ name: 'billingAddressId' })
  billingAddress: Address;

  @ManyToMany(() => Product)
  products: Product[];
}
