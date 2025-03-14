import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MoodType, SubMoodType } from 'shared';

export class UpdateMoodDto {
  @IsEnum(MoodType, { message: 'Invalid mood type' })
  @IsOptional()
  mood?: MoodType;

  @IsEnum(SubMoodType, { message: 'Invalid sub-mood type' })
  @IsOptional()
  subMood?: SubMoodType;

  @IsString()
  @IsOptional()
  note?: string;
}
