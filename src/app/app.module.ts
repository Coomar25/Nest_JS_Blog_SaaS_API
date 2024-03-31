import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';
import { BlogPostModule } from 'src/blog_post/blog_post.module';

@Module({
  imports: [AuthModule, UserModule, AdminModule, BlogPostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
