import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsObject, IsNumber, ValidateNested } from 'class-validator';
import { MoodType, HealthData } from '../mood-entry.entity';
import { Type } from 'class-transformer';

export class HealthDataDto implements HealthData {
  @IsNumber()
  @IsOptional()
  steps?: number;

  @IsNumber()
  @IsOptional()
  distance?: number;

  @IsNumber()
  @IsOptional()
  calories?: number;
}

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

  @IsOptional()
  @ValidateNested()
  @Type(() => HealthDataDto)
  healthData?: HealthDataDto;
}