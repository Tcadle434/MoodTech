import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MoodEntry } from './mood-entry.entity';
import { User } from '../users/user.entity';
import { MoodType, SubMoodType } from 'shared';
@Injectable()
export class MoodsService {
  constructor(
    @InjectRepository(MoodEntry)
    private moodEntriesRepository: Repository<MoodEntry>,
  ) {}

  async findAll(userId: string): Promise<MoodEntry[]> {
    return this.moodEntriesRepository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<MoodEntry> {
    const entry = await this.moodEntriesRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!entry) {
      throw new NotFoundException(`Mood entry with ID "${id}" not found`);
    }

    return entry;
  }

  async findByDate(date: string, userId: string): Promise<MoodEntry | null> {
    return this.moodEntriesRepository.findOne({
      where: { date, user: { id: userId } },
    });
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
    userId: string,
  ): Promise<MoodEntry[]> {
    return this.moodEntriesRepository.find({
      where: {
        date: Between(startDate, endDate),
        user: { id: userId },
      },
      order: { date: 'ASC' },
    });
  }

  async create(
    date: string,
    mood: MoodType,
    user: User,
    note?: string,
    subMood?: SubMoodType,
  ): Promise<MoodEntry> {
    // Check if entry for this date already exists
    const existingEntry = await this.findByDate(date, user.id);

    if (existingEntry) {
      // Update existing entry
      existingEntry.mood = mood;
      existingEntry.subMood = subMood;
      if (note !== undefined) {
        existingEntry.note = note;
      }
      return this.moodEntriesRepository.save(existingEntry);
    }

    // Create new entry
    const newEntry = this.moodEntriesRepository.create({
      date,
      mood,
      subMood,
      note,
      user,
    });

    return this.moodEntriesRepository.save(newEntry);
  }

  async update(
    id: string,
    userId: string,
    updates: Partial<MoodEntry>,
  ): Promise<MoodEntry> {
    const entry = await this.findOne(id, userId);

    // Update entry fields
    Object.assign(entry, updates);

    return this.moodEntriesRepository.save(entry);
  }

  async remove(id: string, userId: string): Promise<void> {
    const entry = await this.findOne(id, userId);
    await this.moodEntriesRepository.remove(entry);
  }
}
