import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';
import { BlogPostModule } from 'src/blog_post/blog_post.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { SocketGateway } from 'src/socket/socket.gateway';
import { LoggerModule } from 'utils/logger.module';
import { GoogleStrategy } from 'src/auth/strategy/goole.strategy';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AdminModule,
    BlogPostModule,
    //for static uploded image rendering
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/uploads'),
      serveRoot: 'uploads',
    }),
    //for env credentials
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Registering the Logger Module in app
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway, GoogleStrategy],
})
export class AppModule {}
