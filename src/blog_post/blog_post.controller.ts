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
} from '@nestjs/common';
import { BlogPostService } from './blog_post.service';
import { CreateBlogPostDto } from './dto/create-blog_post.dto';
import { UpdateBlogPostDto } from './dto/update-blog_post.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/entities/roles.decorator';
import { RoleEnum } from 'src/constants/enum';

@Controller('blog-post')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Post()
  @Version('1')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  create(@Body() createBlogPostDto: CreateBlogPostDto, @Request() req: any) {
    return this.blogPostService.create(createBlogPostDto, req);
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
