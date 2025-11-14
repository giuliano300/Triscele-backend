// notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PermissionHoliday } from 'src/schemas/permission-holiday.schema';

@WebSocketGateway({
  cors: {
    origin: '*', // o l’URL del tuo frontend
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  sendNewAbsence(operatorName: string) {
    this.server.emit('newAbsence', { operatorName });
  }

  confirmAbsence(p: PermissionHoliday) {
    this.server.emit('confirmAbsence', { p });
  }

  sendNewQuotation(p: string) {
    this.server.emit('sendNewQuotation', { p });
  }
}
