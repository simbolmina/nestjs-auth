import { Product } from '../../products/entities/product.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Profile } from 'src/profiles/entities/profile.entity';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';

export enum UserStatus {
  Pending = 'pending',
  Active = 'active',
  Inactive = 'inactive',
  Blocked = 'blocked',
  SoftDeleted = 'soft_deleted',
  Deleted = 'deleted',
}

@Entity('users')
@Index(['googleId', 'email', 'id'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Product, (product) => product.owner)
  products: Product[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart[];

  @OneToMany((type) => Wishlist, (wishlist) => wishlist.user, {
    cascade: true,
  })
  wishlists: Wishlist[];

  @OneToMany(() => Notification, (notification) => notification.recipientUserId)
  notifications: Notification[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @Column({ nullable: true })
  fcmToken: string;

  @Column({ nullable: true })
  isActivatedWithEmail: boolean;

  @Column({ nullable: true })
  isActivatedWithPhone: boolean;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  lastActive: Date;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['google', 'apple', 'none'],
    default: 'none',
  })
  provider: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['user', 'manager', 'admin'],
    default: 'user',
  })
  role: string;

  @Column({
    type: String,
    enum: UserStatus,
    default: UserStatus.Active,
  })
  status: UserStatus;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];

  @Column({ default: 0 })
  tokenVersion: number;

  @Column({ nullable: true })
  passwordChangedAt: Date;

  @Column({ nullable: true })
  passwordResetCode: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @Column({ nullable: true })
  passwordResetVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

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
