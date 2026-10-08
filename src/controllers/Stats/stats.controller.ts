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

  @Get('dashboard/open-quotes')
  async getOpenQuotes(@Query('limit') limit?: string) {
    return this.statsService.getOpenQuotes(limit ? parseInt(limit, 10) : undefined);
  }

  @Get('dashboard/recent-approved-orders')
  async getRecentApprovedOrders(@Query('limit') limit?: string) {
    return this.statsService.getRecentApprovedOrders(limit ? parseInt(limit, 10) : undefined);
  }

  @Get('customer')
  async getStatsOfCustomer(@Query('year') year?: string, @Query('customerId') customerId?: string) {
    const y = year ? parseInt(year) : undefined;
    const c = customerId ? customerId : undefined;
    return this.statsService.getStatsOfCustomer(y, c);
  }
}
