import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionHoliday, PermissionHolidaySchema } from 'src/schemas/permission-holiday.schema';
import { PermissionHolidayService } from 'src/services/permission-holiday.service';
import { PermissionHolidayController } from './permission-holiday.controller';
import { NotificationModule } from 'src/notifications/notifications.module';
import { Operator, OperatorSchema } from 'src/schemas/operators.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PermissionHoliday.name, schema: PermissionHolidaySchema },
      { name: Operator.name, schema: OperatorSchema },
    ]),
    NotificationModule
  ],
  controllers: [PermissionHolidayController],
  providers: [PermissionHolidayService],
  exports: [PermissionHolidayService],
})
export class PermissionHolidayModule {}
