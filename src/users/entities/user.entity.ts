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

  @Column({ nullable: true })
  googleId: string;

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
  passwordResetCode: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

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
