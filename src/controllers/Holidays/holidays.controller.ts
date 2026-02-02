import { Controller, Get, Post, Body, Query, Put, Param, Delete } from '@nestjs/common';
import { CreateHolidayDto } from 'src/dto/create-holiday.dto';
import { Holiday } from 'src/schemas/holiday.schema';
import { HolidaysService } from 'src/services/holidays.service';

@Controller('holidays')
export class HolidaysController {

  constructor(private readonly service: HolidaysService) {}

  // 🔹 Festivi italiani + vestivi
  @Get()
  async getAll(@Query('year') year: number) {
    return this.service.getAllHolidays(+year);
  }

  // 🔹 Solo festivi italiani
  @Get('italian')
  getItalian(@Query('year') year: number) {
    return this.service.getItalianHolidays(+year);
  }

  @Get('custom')
  getCustom(@Query('year') year?: number) {
    return this.service.getAllCustomHolidays(year);
  }

  // 🔹 Inserimento giorno vestivo
  @Post()
  create(@Body() dto: CreateHolidayDto) {
    return this.service.createCustomHoliday(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() h: CreateHolidayDto
  ): Promise<Holiday> {
    return this.service.update(id, h);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.service.remove(id);
  }
}
