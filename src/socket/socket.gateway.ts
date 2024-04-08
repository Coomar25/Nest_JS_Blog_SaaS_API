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

interface LiveBlog {
  blog_id: number;
  user_id: number;
}

interface countSingleBlogLiveCount {
  blog_id: number;
}

@UseGuards(JwtSocketGuard)
@WebSocketGateway(5000)
export class SocketGateway {
  @WebSocketServer() server: Server;

  private connectedClients = new Map<string, Set<Socket>>();
  private blogClients = new Map<string, number>();

  handleConnection(@ConnectedSocket() client: Socket) {
    // Initialize the client's private room
    console.log(
      `🚀 ~ SocketGateway ~ handleConnection ~ client.id: ${client.id} is connected`,
    );
    this.connectedClients.set(client.id, new Set());
  }

  @SubscribeMessage('blogLiveCounts')
  handleBlogLiveCounts(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: LiveBlog,
  ) {
    const parsedMessage: LiveBlog = JSON.parse(`${message}`);
    console.log('🚀 ~ SocketGateway ~ jsonStringify:', parsedMessage.blog_id); //🚀 ~ SocketGateway ~ jsonStringify: 2

    if (!this.blogClients.has(client.id)) {
      console.log('🚀 ~ SocketGateway ~ client.id, :', client.id); //🚀 ~ SocketGateway ~ client.id, : 7Fu4_qBToYPCBrlkAAAB
      this.blogClients.set(client.id, parsedMessage.blog_id);
    }
    console.log('🚀 ~ SocketGateway ~ this.blogClients:', this.blogClients); // example 🚀 ~ SocketGateway ~ this.blogClients: Map(1) { '7Fu4_qBToYPCBrlkAAAB' => 2 }

    // //getting all the values stored in blogClients
    const allBlogClientsValues = Array.from(this.blogClients.values());
    console.log(
      '🚀 ~ SocketGateway ~ allBlogClientsValues:',
      allBlogClientsValues,
    ); ///example :- 🚀 ~ SocketGateway ~ allBlogClientsValues: [ 2 ]

    const filteredValues = allBlogClientsValues.filter((blog_id) => {
      return blog_id === parsedMessage.blog_id;
    });
    console.log(
      '🚀 ~ SocketGateway ~ filteredValues ~ filteredValues:',
      filteredValues,
      filteredValues.length,
    ); //🚀 ~ SocketGateway ~ filteredValues ~ filteredValues: [ 2 ] 1

    this.server.emit('liveCountsSingleBlog', filteredValues.length);
  }

  @SubscribeMessage('getSingleBlogLiveCount')
  getSingleBlogLiveCounts(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: countSingleBlogLiveCount,
  ) {
    console.log('🚀 ~ SocketGateway ~ message:', message);
    this.server.emit('singleBlogLiveCount', message);
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() message: object) {
    console.log('🚀 ~ SocketGateway ~ handleEvent ~ id:', message);
    this.server.emit('ksub', message);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log('🚀 ~ SocketGateway ~ handleMessage ~ message:', message);
    this.server.emit('messages', message);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.connectedClients.delete(client.id);
    this.blogClients.delete(client.id);

    const countConnectedClient = Array.from(
      this.connectedClients.values(),
    ).length;

    const countConnectedBlogClient = Array.from(
      this.blogClients.values(),
    ).length;

    console.log(
      '🚀 ~ SocketGateway ~ handleDisconnect ~  this.connectedClients:',
      countConnectedClient,
    );
    console.log(
      '🚀 ~ SocketGateway ~ handleDisconnect ~ this.blogClients:',
      countConnectedBlogClient,
    );
  }
}
