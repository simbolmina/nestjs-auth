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
import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../../addresses/entities/address.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Entity('users')
@Index(['googleId', 'email', 'id'], { unique: true })
export class User {
  @ApiProperty({
    description: 'The id of the user',
    example: '02302d6e-4eea-403d-a466-6ba902b004fb',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
  })
  @Column({ unique: true })
  email: string;

  //relations start here
  // Keep this as it is (no Swagger decorator needed for relations)
  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart[];

  @OneToMany((type) => Wishlist, (wishlist) => wishlist.user, {
    cascade: true,
  })
  wishlists: Wishlist[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
  //relations end here

  @ApiProperty({
    description: 'The display name of the user',
    example: 'JohnDoe',
    required: false,
  })
  @Column({ nullable: true })
  displayName: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    required: false,
  })
  @Column({ nullable: true })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    required: false,
  })
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty({
    description: 'The bio of the user',
    example: 'Lorem ipsum dolor sit amet...',
    required: false,
  })
  @Column({ nullable: true })
  bio: string;

  @ApiProperty({
    description: 'Indicates if the user is activated with email',
    example: false,
    required: false,
  })
  @Column({ nullable: true })
  isActivatedWithEmail: boolean;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
    required: false,
  })
  @Column({ nullable: true })
  phoneNumber: string;

  @ApiProperty({
    description: 'Indicates if the user is activated with phone',
    example: false,
    required: false,
  })
  @Column({ nullable: true })
  isActivatedWithPhone: boolean;

  @ApiProperty({
    description: 'The Google ID of the user',
    example: '123456789012345678901',
    required: false,
  })
  @Column({ nullable: true })
  googleId: string;

  @ApiProperty({
    description: 'The profile picture of the user',
    example: '/assets/placeholder/instagram.svg',
    required: false,
  })
  @Column({ nullable: true, default: '/assets/placeholder/instagram.svg' })
  picture: string;

  @ApiProperty({
    description: 'The last active date of the user',
    example: '2023-05-09T08:00:00.000Z',
    required: false,
  })
  @Column({ nullable: true })
  lastActive: Date;

  @ApiProperty({
    description: 'The birth date of the user',
    example: '1990-01-01',
    required: false,
  })
  @Column({ nullable: true })
  birthDate: Date;

  @ApiProperty({
    description: 'The gender of the user',
    example: 'other',
    enum: ['male', 'female', 'other'],
  })
  @Column({
    nullable: false,
    type: 'enum',
    enum: ['male', 'female', 'other'],
    default: 'other',
  })
  gender: string;

  @ApiProperty({
    description: 'Provider of the user account source',
    example: 'google',
    enum: ['google', 'apple', 'none'],
  })
  @Column({
    nullable: false,
    type: 'enum',
    enum: ['google', 'apple', 'none'],
    default: 'none',
  })
  provider: string;

  @Column({ nullable: true })
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
    enum: ['user', 'manager', 'admin'],
  })
  @Column({
    nullable: false,
    type: 'enum',
    enum: ['user', 'manager', 'admin'],
    default: 'user',
  })
  role: string;
  @ApiProperty({
    description: 'Indicates if the user is active',
    example: true,
    required: false,
  })
  @Column({ nullable: true, default: true })
  active: boolean;

  @ApiProperty({
    description: 'The average rating of the user',
    example: 0,
    required: false,
  })
  @Column({ nullable: true, default: 0 })
  ratingsAverage: number;

  @ApiProperty({
    description: 'The total number of ratings for the user',
    example: 0,
    required: false,
  })
  @Column({ nullable: true, default: 0 })
  ratingsQuantity: number;

  @ApiProperty({
    description: 'Indicates if the user is a VIP',
    example: false,
    required: false,
  })
  @Column({ nullable: true, default: false })
  isVIP: boolean;

  @ApiProperty({
    description: 'The date when the user changed their password',
    example: '2023-05-01T08:00:00.000Z',
    required: false,
  })
  @Column({ nullable: true })
  passwordChangedAt: Date;

  @ApiProperty({
    description: 'The password reset code for the user',
    example: 'reset123',
    required: false,
  })
  @Column({ nullable: true })
  passwordResetCode: string;

  @ApiProperty({
    description: 'The expiration date for the password reset code',
    example: '2023-05-10T08:00:00.000Z',
    required: false,
  })
  @Column({ nullable: true })
  passwordResetExpires: Date;

  @ApiProperty({
    description: 'Indicates if the password reset has been verified',
    example: false,
    required: false,
  })
  @Column({ nullable: true })
  passwordResetVerified: boolean;

  @ApiProperty({ description: 'The date when the user was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'The date when the user was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'The date when the user was deleted',
    required: false,
  })
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
