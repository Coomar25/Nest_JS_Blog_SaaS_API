import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(5000)
export class SocketGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: any): string {
    return data;
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log('🚀 ~ SocketGateway ~ handleMessage ~ message:', message);
    this.server.emit('messages', message);
  }
}
