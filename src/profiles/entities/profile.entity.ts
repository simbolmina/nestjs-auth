import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column() // This line assumes you are directly storing the userId.
  userId: string;

  @OneToMany(() => Review, (review) => review.profile)
  reviews: Review[];

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true, default: '/assets/placeholder/instagram.svg' })
  picture: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['male', 'female', 'other'],
    default: 'other',
  })
  gender: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true, default: 0 })
  ratingsAverage: number;

  @Column({ nullable: true, default: 0 })
  ratingsQuantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
