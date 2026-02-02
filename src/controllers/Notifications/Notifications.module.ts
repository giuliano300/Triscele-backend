import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {  NotificationsController } from './Notifications.controller';
import { Notifications } from 'src/schemas/notifications.schema';
import { NotificationsService } from 'src/services/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notifications.name, schema: Notifications }]),
    NotificationsModule
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
