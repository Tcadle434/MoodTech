import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MoodType } from '../mood-entry.entity';

export class CreateMoodDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(MoodType, { message: 'Mood must be happy, neutral, or sad' })
  @IsNotEmpty()
  mood: MoodType;

  @IsString()
  @IsOptional()
  note?: string;
}