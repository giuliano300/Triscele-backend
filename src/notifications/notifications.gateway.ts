import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PermissionHoliday } from 'src/schemas/permission-holiday.schema';
import { NotificationsService } from 'src/services/notification.service';

@WebSocketGateway({
  cors: {
    origin: '*', // o l’URL del tuo frontend
  },
})
export class NotificationsGateway {

  constructor(
    private readonly notifications: NotificationsService
  ) {}

  @WebSocketServer()
  server: Server;

  //ALL' ADMIN
  async sendNewAbsence(operatorName: string) {
    // salvo la notifica su DB
    const notification = await this.notifications.create(
      null, 
      'admin',
      'newAbsence',
      { operatorName }
    );

    // emetto il socket con l'ID della notifica
    this.server.emit('newAbsence', {
      operatorName,
      notificationId: notification._id.toString()
    });
  }

  //ALL' OPERATORE
  async confirmAbsence(p: PermissionHoliday) {
    const notification =  await this.notifications.create(
      p.operatorId.toString(),
      'operator',
      'confirmAbsence',
      { p }
    );

    this.server.emit('confirmAbsence', { p, notificationId: notification._id.toString() });
  }

  //ALL' ADMIN
  async sendNewQuotation(p: string) {
    const notification = await this.notifications.create(
      null,
      'admin',
      'sendNewQuotation',
      { p }
    );

    this.server.emit('sendNewQuotation', { p, notificationId: notification._id.toString() });
  }

  //AL CLIENTE
  async updateOrderStatus(customerId: string, id: string, status: string) {
    const notification = await this.notifications.create(
      customerId,
      'customer',
      'updateOrderStatus',
      { id, status }
    );

    this.server.emit('updateOrderStatus', { id, customerId, status, notification: notification._id.toString() });
  }

  //AL CLIENTE
  async createOrderFromQuotation(customerId: string, id: string) {
    const notification = await this.notifications.create(
      customerId,
      'customer',
      'createOrderFromQuotation',
      { id }
    );
    this.server.emit('createOrderFromQuotation', { id, customerId, notification: notification._id.toString() });
  }
}
