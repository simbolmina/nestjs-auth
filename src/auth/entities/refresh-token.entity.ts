import { User } from 'src/users/entities/user.entity';
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
  id: string; // Assuming you want to use UUIDs for IDs, otherwise just use 'increment' for numerical IDs

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
