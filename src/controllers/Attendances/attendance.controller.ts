import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AttendanceDto } from 'src/dto/attendance.dto';
import { CalendarService } from 'src/services/calendar.service';
import { AttendanceService } from 'src/services/attendance.service';
@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly calendarService: CalendarService
) {}

  @Post()
  async create(@Body() dto: AttendanceDto) {
    return this.attendanceService.create(dto);
  }

  @Get()
  async findAll(@Query('operatorId') operatorId?: string) {
    return this.attendanceService.findAll(operatorId);
  }

  @Get('calendar')
  async getCalendarEvents(@Query('operatorId') operatorId?: string) {
    return this.calendarService.getCalendarEvents(operatorId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.attendanceService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<AttendanceDto>) {
    return this.attendanceService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.attendanceService.delete(id);
  }
}
