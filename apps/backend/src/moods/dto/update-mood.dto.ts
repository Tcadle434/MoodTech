import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { MoodType } from '../mood-entry.entity';
import { Type } from 'class-transformer';
import { HealthDataDto } from './create-mood.dto';

export class UpdateMoodDto {
  @IsEnum(MoodType, { message: 'Mood must be happy, neutral, or sad' })
  @IsOptional()
  mood?: MoodType;

  @IsString()
  @IsOptional()
  note?: string;
  
  @IsOptional()
  @ValidateNested()
  @Type(() => HealthDataDto)
  healthData?: HealthDataDto;
}