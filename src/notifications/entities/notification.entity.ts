import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

enum NotificationType {
  Announcement = 'announcement',
  Message = 'message',
  Interest = 'interest',
  Favorite = 'favorite',
  Reviews = 'review',
  Match = 'match',
}

enum NotificationDeliveryMethod {
  Email = 'email',
  Push = 'push',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.notifications)
  recipientUserId: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ type: 'uuid', nullable: true })
  relatedContentId?: string;

  @Column()
  message: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: NotificationDeliveryMethod,
  })
  deliveryMethod: NotificationDeliveryMethod;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isSent: boolean;

  @Column({ type: 'bigint', nullable: true })
  sendAt?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
