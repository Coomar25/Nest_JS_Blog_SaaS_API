import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BlogPostStatus } from '@prisma/client';
import { ResponseEnum } from 'src/constants/enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderByDto } from '../dto/create-blog_post.dto';

@Injectable()
export class BlogApproveService {
  constructor(private prismaService: PrismaService) {}

  async approveBlogPost(blog_id: number) {
    try {
      const isExist = await this.prismaService.blog_post.findUnique({
        where: {
          id: blog_id,
        },
      });

      if (!isExist) {
        return {
          message: ResponseEnum.NOT_FOUND,
          status: HttpStatus.NOT_FOUND,
        };
      }

      await this.prismaService.blog_post.update({
        where: {
          id: blog_id,
        },
        data: {
          status: BlogPostStatus.PUBLISHED,
        },
      });

      return {
        message: ResponseEnum.SUCCESS,
        status: HttpStatus.ACCEPTED,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUnApprovedBlog() {
    try {
      const unApprovedBP = await this.prismaService.blog_post.findMany({
        where: {
          status: BlogPostStatus.PENDING,
        },
      });

      if (unApprovedBP) {
        return {
          message: ResponseEnum.NOT_FOUND,
          status: HttpStatus.NOT_FOUND,
        };
      }

      return {
        message: ResponseEnum.SUCCESS,
        status: ResponseEnum.SUCCESS,
        data: unApprovedBP,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getFilteredUnapprovedBlog(
    page: number,
    perPage: number,
    category?: string,
    orderBy?: OrderByDto,
  ) {
    try {
      const skip = (page - 1) * perPage;

      const unApprovedBP = await this.prismaService.blog_post.findMany({
        where: {
          status: BlogPostStatus.PENDING,
          ...(category && {
            blog_categories: {
              name: category,
            },
          }),
        },
        orderBy: {
          ...(orderBy &&
            orderBy.asc && {
              blog_categories: {
                name: 'asc',
              },
            }),
          ...(orderBy &&
            orderBy.desc && {
              blog_categories: {
                name: 'desc',
              },
            }),
        },
        skip,
        take: perPage,
      });

      if (unApprovedBP.length === 0) {
        return {
          message: ResponseEnum.NOT_FOUND,
          status: HttpStatus.NOT_FOUND,
        };
      }

      return {
        message: ResponseEnum.SUCCESS,
        status: HttpStatus.OK,
        data: unApprovedBP,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
