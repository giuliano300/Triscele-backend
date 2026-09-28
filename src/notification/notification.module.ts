import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from '../services/notification.service';
import { Notifications, NotificationSchema } from 'src/schemas/notifications.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notifications.name, schema: NotificationSchema }]),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationModule {}
