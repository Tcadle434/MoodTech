import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MoodType } from '../mood-entry.entity';

export class UpdateMoodDto {
  @IsEnum(MoodType, { message: 'Mood must be happy, neutral, or sad' })
  @IsOptional()
  mood?: MoodType;

  @IsString()
  @IsOptional()
  note?: string;
}