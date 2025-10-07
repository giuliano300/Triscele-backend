import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from '../../services/stat.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats(@Query('year') year?: string) {
    const y = year ? parseInt(year) : undefined;
    return this.statsService.getStats(y);
  }
}
