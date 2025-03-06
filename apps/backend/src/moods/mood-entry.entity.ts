import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

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
    type: 'text', // Use text for simplicity instead of enum to avoid PostgreSQL enum creation issues
    enum: MoodType,
    default: MoodType.NEUTRAL,
  })
  mood: MoodType;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, user => user.moodEntries)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}