// notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

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
}
