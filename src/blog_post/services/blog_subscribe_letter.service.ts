import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ResponseEnum } from 'src/constants/enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscribeBlogDto } from '../dto/create-blog_post.dto';

interface SubscribeBlogRequest {
  user_id: number;
  email: string;
}

@Injectable()
export class BlogSubscribeLetter {
  constructor(private prismaService: PrismaService) {}

  async createBlogSubscribeLetter(subscribeDto: SubscribeBlogDto) {
    console.log(
      '🚀 ~ BlogSubscribeLetter ~ createBlogSubscribeLetter ~ subscribeDto:',
      subscribeDto.email,
      subscribeDto.userId,
    );
    const isExist = await this.prismaService.blog_user.findUnique({
      where: {
        id: subscribeDto.userId,
      },
    });

    if (!isExist) {
      throw new HttpException(ResponseEnum.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.prismaService.blog_subscribe_letter.create({
      data: {
        email: subscribeDto.email,
        user_id: subscribeDto.userId,
      },
    });

    return {
      message: ResponseEnum.SUCCESS,
      status: HttpStatus.ACCEPTED,
    };
  }

  async blogUnsubscribeLetter(req: SubscribeBlogRequest) {
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
