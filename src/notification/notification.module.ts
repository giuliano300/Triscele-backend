import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from '../services/notification.service';
import { NotificationsGateway } from './notification.gateway';
import { Notifications, NotificationSchema } from 'src/schemas/notifications.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notifications.name, schema: NotificationSchema }]),
  ],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationModule {}
