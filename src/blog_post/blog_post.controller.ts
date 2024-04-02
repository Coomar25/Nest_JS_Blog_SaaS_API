import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Version,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { BlogPostService } from './blog_post.service';
import {
  BlogCatgoryDto,
  BlogCommentDto,
  CreateBlogPostDto,
} from './dto/create-blog_post.dto';
import { UpdateBlogPostDto } from './dto/update-blog_post.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/entities/roles.decorator';
import { RoleEnum } from 'src/constants/enum';
import { LikeDislikeDto } from './dto/like-dislike-post.dto';

@Controller('blog-post')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Post('category')
  @Version('1')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  callBlogCategory(@Body() blogCategoryDto: BlogCatgoryDto) {
    return this.blogPostService.createBlogCategory(blogCategoryDto);
  }

  /**
   * Create a new blog post.
   *
   * @param createBlogPostDto - The data for creating the blog post.
   * @param req - The request object.
   * @returns The created blog post.
   */
  @Post()
  @Version('1')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  create(@Body() createBlogPostDto: CreateBlogPostDto, @Request() req: any) {
    return this.blogPostService.create(createBlogPostDto, req);
  }

  @Post('likedislike/:blog_id')
  @Version('1')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  callLikeDislike(
    @Param(
      'blog_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    blog_id: number,
    @Body() likedislikedto: LikeDislikeDto,
    @Request() req: any,
  ) {
    return this.blogPostService.likeDislike(blog_id, likedislikedto, req);
  }

  @Post('comment/:blog_id')
  @Version('1')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  callBlogComment(
    @Param('blog_id') blog_id: number,
    @Body() blogCommentDto: BlogCommentDto,
    @Request() req: any,
  ) {
    return this.blogPostService.createBlogComment(blog_id, blogCommentDto, req);
  }

  @Get()
  findAll() {
    return this.blogPostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogPostService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ) {
    return this.blogPostService.update(+id, updateBlogPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogPostService.remove(+id);
  }
}
