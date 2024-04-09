import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseEnum } from 'src/constants/enum';
import { PrismaService } from 'src/prisma/prisma.service';

interface SubscribeBlogRequest {
  user_id: number;
  email: string;
}

@Injectable()
export class BlogSubscribeLetter {
  constructor(private prismaService: PrismaService) {}

  async createBlogSubscribeLetter(req: SubscribeBlogRequest) {
    try {
      const isExist = await this.prismaService.blog_user.findUnique({
        where: {
          id: req.user_id,
        },
      });

      if (!isExist) {
        throw new HttpException(ResponseEnum.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      await this.prismaService.blog_subscribe_letter.create({
        data: {
          email: req.email,
          user_id: req.user_id,
        },
      });

      return {
        message: ResponseEnum.SUCCESS,
        status: HttpStatus.ACCEPTED,
      };
    } catch (err) {
      throw new HttpException(
        `${err} ${ResponseEnum.INTERNAL_SERVER_ERROR} `,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async blogUnsubscribeLetter(req: Request) {
    try {
      const isExistSubscribeLetter =
        await this.prismaService.blog_subscribe_letter.findFirst({
          where: {
            user_id: req.user_id,
            email: req.email,
          },
          select: {
            id: true,
            email: true,
            user_id: true,
          },
        });
      if (!isExistSubscribeLetter) {
        throw new HttpException(ResponseEnum.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      await this.prismaService.blog_subscribe_letter.delete({
        where: {
          id: isExistSubscribeLetter.id,
        },
      });
    } catch (err) {
      throw new HttpException(
        `${err} ${ResponseEnum.INTERNAL_SERVER_ERROR} `,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
