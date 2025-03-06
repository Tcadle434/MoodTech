import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodEntry } from './mood-entry.entity';
import { MoodsService } from './moods.service';
import { MoodsController } from './moods.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MoodEntry]),
    UsersModule,
  ],
  providers: [MoodsService],
  controllers: [MoodsController],
  exports: [MoodsService],
})
export class MoodsModule {}