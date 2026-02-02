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

  @Get('month-events')
  async getMonthlyCalendarEvents(
    @Query('month') month: string,
    @Query('year') year: string,
    @Query('operatorId') operatorId?: string
  ) {
    const m = parseInt(month);
    const y = parseInt(year);
    const events = await this.calendarService.getMonthlyCalendarEvents(m, y, operatorId);
    return { success: true, data: events };
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

  // ✅ Verifica se esiste una presenza oggi per un operatore
  @Get('exist/:operatorId')
  async existTodayAttendance(@Param('operatorId') operatorId: string) {
    return this.attendanceService.existTodayAttendance(operatorId);
  }

  // ✅ Ottiene la presenza di oggi per un operatore
  @Get('today/:operatorId')
  async getTodayAttendance(@Param('operatorId') operatorId: string) {
    return this.attendanceService.getTodayAttendance(operatorId);
  }
}
