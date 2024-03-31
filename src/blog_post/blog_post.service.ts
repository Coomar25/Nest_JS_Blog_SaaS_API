import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlogPostDto } from './dto/create-blog_post.dto';
import { UpdateBlogPostDto } from './dto/update-blog_post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseEnum } from 'src/constants/enum';

@Injectable()
export class BlogPostService {
  constructor(private prismaService: PrismaService) {}

  async create(createBlogPostDto: CreateBlogPostDto, req: any) {
    console.log('🚀 ~ BlogPostService ~ create ~ req:', req.user);
    try {
      const [isExist, isValid_authorId, isValid_categoryId] = await Promise.all(
        [
          this.prismaService.blog_post.findUnique({
            where: {
              slug: createBlogPostDto.slug,
            },
          }),
          this.prismaService.blog_user.findUnique({
            where: {
              id: createBlogPostDto.authorId,
            },
          }),
          this.prismaService.blog_categories.findUnique({
            where: {
              id: createBlogPostDto.category_id,
            },
          }),
        ],
      );
      console.log(
        '🚀 ~ BlogPostService ~ create ~ isExist, isValid_authorId, isValid_categoryId:',
        isExist,
        isValid_authorId,
        isValid_categoryId,
      );

      if (!isValid_categoryId || !isValid_authorId) {
        const message = !isValid_categoryId
          ? 'Category with that id not found'
          : 'Author with that id not found';
        throw new HttpException(
          `${message}` + ' ' + ResponseEnum.NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      if (isExist) {
        throw new HttpException(ResponseEnum.CONFLICT, HttpStatus.CONFLICT);
      }

      await this.prismaService.blog_post.create({
        data: {
          slug: createBlogPostDto.slug,
          title: createBlogPostDto.title,
          description: createBlogPostDto.description,
          tags: createBlogPostDto.tags,
          blog_categories: {
            connect: {
              id: createBlogPostDto.category_id,
            },
          },
          blog_user: {
            connect: {
              id: createBlogPostDto.authorId,
            },
          },
        },
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return 'This action adds a new blogPost';
  }

  findAll() {
    return `This action returns all blogPost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogPost`;
  }

  update(id: number, updateBlogPostDto: UpdateBlogPostDto) {
    return `This action updates a #${id} blogPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogPost`;
  }
}
