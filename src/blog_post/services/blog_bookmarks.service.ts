import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseEnum } from 'src/constants/enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlogBookMarksServices {
  constructor(private prismaService: PrismaService) {}

  // Blog BookMarks

  async blogBoorkmarks(blog_id: number, req: any) {
    try {
      const isExistBookmarks =
        await this.prismaService.blog_bookmarks.findUnique({
          where: {
            id: +blog_id,
            user_id: +req.user.id,
          },
        });
      if (isExistBookmarks) {
        throw new HttpException(ResponseEnum.CONFLICT, HttpStatus.CONFLICT);
      }

      await this.prismaService.blog_bookmarks.create({
        data: {
          blog_id: +blog_id,
          user_id: +req.user.id,
        },
      });

      return {
        message: ResponseEnum.SUCCESS,
        status: HttpStatus.CREATED,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSingleUsrBlogBookmarks(req: any) {
    try {
      const checkIsBMExists = await this.prismaService.blog_bookmarks.findMany({
        where: {
          user_id: +req.user.id,
        },
        select: {
          blog_post: {
            include: {
              _count: {
                select: {
                  blog_bookmarks: true,
                  blog_like_dislike: {
                    where: {
                      like: true,
                    },
                  },
                  blog_comment: true,
                  blog_total_viewed_post: true,
                },
              },
            },
          },
        },
      });

      if (!checkIsBMExists) {
        throw new HttpException(ResponseEnum.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      return {
        message: ResponseEnum.SUCCESS,
        status: HttpStatus.OK,
        data: checkIsBMExists,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeBlogBookmarks(blog_id: number, req: any) {
    try {
      const isExistBookmarks =
        await this.prismaService.blog_bookmarks.findUnique({
          where: {
            id: +blog_id,
            user_id: +req.user.id,
          },
        });

      if (!isExistBookmarks) {
        throw new HttpException(ResponseEnum.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      await this.prismaService.blog_bookmarks.delete({
        where: {
          id: +blog_id,
          user_id: +req.user.id,
        },
      });

      return {
        message: ResponseEnum.SUCCESS,
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
