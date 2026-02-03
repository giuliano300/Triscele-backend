import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {  IllnessController } from './illness.controller';
import { Illness, IllnessSchema } from 'src/schemas/illness.schema';
import { IllnessService } from 'src/services/illness.service';
import { NotificationModule } from 'src/notification/notification.module';
import { Operator, OperatorSchema } from 'src/schemas/operators.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Illness.name, schema: IllnessSchema }]),
    MongooseModule.forFeature([{ name: Operator.name, schema: OperatorSchema }]),
    NotificationModule
  ],
  controllers: [IllnessController],
  providers: [IllnessService],
})
export class IllnessModule {}
