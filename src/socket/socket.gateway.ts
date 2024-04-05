import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtSocketGuard } from 'src/auth/guard/socket.guard';
@UseGuards(JwtSocketGuard)
@WebSocketGateway(5000)
export class SocketGateway {
  @WebSocketServer() server: Server;

  //   async handleConnection(client: Socket): Promise<void> {
  //     const token = client.handshake.query.token as string;
  //     try {
  //       const decodedToken = Jwt.verify(token, configCredentials.JWTSECRET);
  //       console.log(
  //         '🚀 ~ SocketGateway ~ handleConnection ~ decodedToken:',
  //         decodedToken.user,
  //       );
  //     } catch (err) {
  //       console.log(`Error verifying token:`, error);
  //       client.disconnect(true);
  //     }
  //   }

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
