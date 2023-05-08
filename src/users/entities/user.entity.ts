import { Product } from '../../products/entities/product.entity';
// import { Product } from 'src/products/entities/product.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
// import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  // @Exclude()
  password: string;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['user', 'manager', 'admin'],
    default: 'user',
  })
  role: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
