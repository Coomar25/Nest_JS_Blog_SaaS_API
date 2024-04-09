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
import { PrismaService } from 'src/prisma/prisma.service';

interface LiveBlog {
  blog_id: number;
  user_id: number;
}

@UseGuards(JwtSocketGuard)
@WebSocketGateway(5000)
export class SocketGateway {
  @WebSocketServer() server: Server;

  private connectedClients = new Map<string, Set<Socket>>();
  private blogClients = new Map<string, number>();
  private prismaService = new PrismaService();
  private connectedUsers = new Map<string, Set<number>>();

  handleConnection(@ConnectedSocket() client: Socket) {
    // Initialize the client's private room
    this.connectedClients.set(client.id, new Set());
    console.log(
      '🚀 ~ SocketGateway ~ handleConnection ~  this.connectedClients:',
      this.connectedClients,
      this.connectedClients.size,
    );
  }

  @SubscribeMessage('blogLiveCounts')
  handleBlogLiveCounts(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: LiveBlog,
  ) {
    const parsedMessage: LiveBlog = JSON.parse(`${message}`);
    const roomName = `blog-${message.blog_id}`;
    if (!this.blogClients.has(client.id)) {
      this.blogClients.set(client.id, parsedMessage.blog_id);
    }
    // //getting all the values stored in blogClients
    const allBlogClientsValues = Array.from(this.blogClients.values());
    const filteredValues = allBlogClientsValues.filter((blog_id) => {
      return blog_id === parsedMessage.blog_id;
    });
    this.server
      .to(roomName)
      .emit('liveCountsSingleBlog', filteredValues.length);
  }

  @SubscribeMessage('joinBlogRoom')
  handleJoinBlogRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LiveBlog,
  ) {
    const { user_id, blog_id } = JSON.parse(`${data}`);
    const roomName = `blog-${blog_id}`;
    //Join the room for the specified blog
    client.join(roomName);
    //Add users to the room's connected users set
    if (!this.connectedUsers.has(roomName)) {
      this.connectedUsers.set(roomName, new Set());
    }
    this.connectedUsers.get(roomName).add(user_id);
    console.log(`User ${user_id} joined room ${roomName}`);
  }

  @SubscribeMessage('isTypingOnComment')
  async handleIsTypingOnComment(
    @ConnectedSocket() cleint: Socket,
    @MessageBody() data: LiveBlog,
  ) {
    const { user_id, blog_id } = JSON.parse(`${data}`);
    const roomName = `blog-${blog_id}`;
    const user = await this.prismaService.blog_user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (user) {
      this.server
        .to(roomName)
        .emit('isTypingComment', `${user.name} is typing`);
    }
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

    const connectedUsers = this.connectedClients.size;
    console.log(
      '🚀 ~ SocketGateway ~ handleDisconnect ~ connectedUsers:',
      connectedUsers,
    );
    const liveVisitorsCount = this.blogClients.size;
    console.log(
      '🚀 ~ SocketGateway ~ handleDisconnect ~ liveVisitorsCount:',
      liveVisitorsCount,
    );

    // const countConnectedClient = Array.from(
    //   this.connectedClients.values(),
    // ).length;

    // const countConnectedBlogClient = Array.from(
    //   this.blogClients.values(),
    // ).length;

    // console.log(
    //   '🚀 ~ SocketGateway ~ handleDisconnect ~  this.connectedClients:',
    //   countConnectedClient,
    // );
    // console.log(
    //   '🚀 ~ SocketGateway ~ handleDisconnect ~ this.blogClients:',
    //   countConnectedBlogClient,
    // );
  }
}
