import { User } from '../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
} from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;

  @Column()
  token: string;

  @Column('bigint')
  expiresIn: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  toBeDeletedAt: Date | null;
}
