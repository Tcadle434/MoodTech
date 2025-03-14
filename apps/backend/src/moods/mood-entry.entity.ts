import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { MoodType, SubMoodType } from 'shared';

@Entity()
export class MoodEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string; // Store as ISO date string (YYYY-MM-DD)

  @Column({
    type: 'text', // Store as text but validate against enum values
    default: MoodType.HAPPY,
  })
  mood: MoodType;

  @Column({
    type: 'text',
    nullable: true,
  })
  subMood?: SubMoodType;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.moodEntries)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
