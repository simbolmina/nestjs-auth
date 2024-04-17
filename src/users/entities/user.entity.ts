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
} from 'typeorm';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { Expose } from 'class-transformer';

export enum UserStatus {
  Pending = 'pending',
  Active = 'active',
  Inactive = 'inactive',
  Blocked = 'blocked',
  SoftDeleted = 'soft_deleted',
  Deleted = 'deleted',
}

export enum UserRoles {
  User = 'user',
  Admin = 'admin',
}

@Entity('users')
@Index(['googleId', 'email', 'id'], { unique: true })
export class User {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  googleId: string | null;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['google', 'apple', 'none'],
    default: 'none',
  })
  provider: string;

  @Column({ nullable: true })
  password: string;

  @Expose()
  @Column({
    nullable: false,
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.User,
  })
  role: UserRoles;

  @Expose()
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

  @Expose()
  @Column({ default: false })
  isTwoFactorAuthEnabled: boolean;

  @Column({ nullable: true })
  twoFactorAuthToken: string;

  @Column({ nullable: true })
  twoFactorAuthTokenExpiry: Date;

  @Column({ nullable: true })
  passwordResetCode: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  static fromPlain(plain: Partial<User>): User {
    // console.log('plain', plain);
    const user = new User();
    // console.log('user', user);
    Object.assign(user, plain);
    // console.log('user', user);
    return user;
  }

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
