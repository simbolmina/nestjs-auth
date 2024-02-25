import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from 'src/profiles/entities/profile.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rating: number;

  @Column()
  content: string;

  // Profile of the user who created the review
  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @Column({ type: 'uuid' })
  profileId: string;

  // Profile of the user being reviewed
  @ManyToOne(() => Profile, (profile) => profile.reviews)
  @JoinColumn({ name: 'reviewedProfileId' })
  reviewedProfile: Profile;

  @Column({ type: 'uuid' })
  reviewedProfileId: string;
}
