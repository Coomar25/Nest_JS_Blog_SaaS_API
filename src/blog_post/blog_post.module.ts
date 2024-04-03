import { Module } from '@nestjs/common';
import { BlogPostService } from './blog_post.service';
import { BlogPostController } from './blog_post.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlogBookMarksServices } from './services/blog_bookmarks.service';

@Module({
  controllers: [BlogPostController],
  providers: [BlogPostService, BlogBookMarksServices, PrismaService],
})
export class BlogPostModule {}
