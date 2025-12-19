import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HolidaysController } from './holidays.controller';
import { Holiday, HolidaySchema } from 'src/schemas/holiday.schema';
import { HolidaysService } from 'src/services/holidays.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Holiday.name, schema: HolidaySchema }
    ])
  ],
  controllers: [HolidaysController],
  providers: [HolidaysService],
  exports: [HolidaysService]
})
export class HolidaysModule {}
