import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtSocketGuard } from 'src/auth/guard/socket.guard';
@UseGuards(JwtSocketGuard)
@WebSocketGateway(5000)
export class SocketGateway {
  @WebSocketServer() server: Server;

  private connectedClients = new Map<string, Set<Socket>>();
  handleConnection(@ConnectedSocket() client: Socket) {
    // Initialize the client's private room
    console.log(
      '🚀 ~ SocketGateway ~ handleConnection ~ client.id:',
      client.id,
    );

    this.connectedClients.set(client.id, new Set());
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody('id') id: number): number {
    console.log('🚀 ~ SocketGateway ~ handleEvent ~ id:', id);
    return id;
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log('🚀 ~ SocketGateway ~ handleMessage ~ message:', message);
    this.server.emit('messages', message);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.connectedClients.delete(client.id);
  }
}
