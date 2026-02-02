import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceController } from './attendance.controller';
import { Attendance, AttendanceSchema } from 'src/schemas/attendance.schema';
import { AttendanceService } from 'src/services/attendance.service';
import { CalendarService } from 'src/services/calendar.service';
import { PermissionHoliday, PermissionHolidaySchema } from 'src/schemas/permission-holiday.schema';
import { Illness, IllnessSchema } from 'src/schemas/illness.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: PermissionHoliday.name, schema: PermissionHolidaySchema },
      { name: Illness.name, schema: IllnessSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, CalendarService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
