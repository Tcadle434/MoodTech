import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MoodsService } from './moods.service';
import { MoodEntry } from './mood-entry.entity';
import { UsersService } from '../users/users.service';
import { CreateMoodDto } from './dto/create-mood.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';

@Controller('moods')
@UseGuards(JwtAuthGuard)
export class MoodsController {
  constructor(
    private readonly moodsService: MoodsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async findAll(@Request() req): Promise<MoodEntry[]> {
    return this.moodsService.findAll(req.user.id);
  }

  @Get('date/:date')
  async findByDate(
    @Param('date') date: string,
    @Request() req,
  ): Promise<MoodEntry | null> {
    return this.moodsService.findByDate(date, req.user.id);
  }

  @Get('range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ): Promise<MoodEntry[]> {
    return this.moodsService.findByDateRange(startDate, endDate, req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<MoodEntry> {
    return this.moodsService.findOne(id, req.user.id);
  }

  @Post()
  async create(
    @Body() createMoodDto: CreateMoodDto,
    @Request() req,
  ): Promise<MoodEntry> {
    console.log(
      'Creating mood entry:',
      createMoodDto,
      'for user ID:',
      req.user.id,
    );
    const { date, mood, note, subMood } = createMoodDto;
    const user = await this.usersService.findOne(req.user.id);
    return this.moodsService.create(date, mood, user, note, subMood);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMoodDto: UpdateMoodDto,
    @Request() req,
  ): Promise<MoodEntry> {
    return this.moodsService.update(id, req.user.id, updateMoodDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.moodsService.remove(id, req.user.id);
  }
}
