import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { MoodType, SubMoodType } from 'shared';

export class CreateMoodDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(MoodType, { message: 'Invalid mood type' })
  @IsNotEmpty()
  mood: MoodType;

  @IsEnum(SubMoodType, { message: 'Invalid sub-mood type' })
  @IsOptional()
  subMood?: SubMoodType;

  @IsString()
  @IsOptional()
  note?: string;
}
