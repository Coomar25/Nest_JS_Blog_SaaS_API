import { Module } from '@nestjs/common';
import { BlogPostService } from './blog_post.service';
import { BlogPostController } from './blog_post.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BlogPostController],
  providers: [BlogPostService, PrismaService],
})
export class BlogPostModule {}
