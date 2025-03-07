import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export interface HealthData {
  steps?: number;
  distance?: number;
  calories?: number;
}

export enum MoodType {
  HAPPY = 'happy',
  NEUTRAL = 'neutral',
  SAD = 'sad',
}

@Entity()
export class MoodEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string; // Store as ISO date string (YYYY-MM-DD)

  @Column({
    type: 'text', // Store as text but validate against enum values
    default: MoodType.NEUTRAL,
  })
  mood: MoodType;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'json', nullable: true })
  healthData: HealthData;

  @ManyToOne(() => User, user => user.moodEntries)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}