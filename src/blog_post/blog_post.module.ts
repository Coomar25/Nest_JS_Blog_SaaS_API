import { Module } from '@nestjs/common';
import { BlogPostService } from './blog_post.service';
import { BlogPostController } from './blog_post.controller';
import { PrismaService } from 'src/prisma/prisma.service';
// import { BlogBookMarksServices } from './services/blog_bookmarks.service';
import { BlogBookMarksServices } from './services/blog_bookmarks.service';
import { FileStorageService } from 'src/file-storage/file-storage.service';
import { BlogApproveService } from './services/blog_approve.service';

@Module({
  controllers: [BlogPostController],
  providers: [
    BlogPostService,
    BlogBookMarksServices,
    FileStorageService,
    PrismaService,
    BlogApproveService,
  ],
})
export class BlogPostModule {}
