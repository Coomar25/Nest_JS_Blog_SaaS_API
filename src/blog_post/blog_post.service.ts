import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  BlogCatgoryDto,
  BlogCommentDto,
  CreateBlogPostDto,
} from './dto/create-blog_post.dto';
import { UpdateBlogPostDto } from './dto/update-blog_post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseEnum } from 'src/constants/enum';
import { LikeDislikeDto } from './dto/like-dislike-post.dto';

@Injectable()
export class BlogPostService {
  constructor(private prismaService: PrismaService) {}

  async createBlogCategory(blogCategoryDto: BlogCatgoryDto) {
    try {
      console.log(
        '🚀 ~ BlogPostService ~ createBlogCategory ~ blogCategoryDto:',
        blogCategoryDto,
      );
      const isExist = await this.prismaService.blog_categories.findFirst({
        where: {
          name: blogCategoryDto.name,
        },
      });
      console.log(
        '🚀 ~ BlogPostService ~ createBlogCategory ~ isExist:',
        isExist,
      );

      if (isExist) {
        throw new HttpException(ResponseEnum.CONFLICT, HttpStatus.CONFLICT);
      }

      await this.prismaService.blog_categories.create({
        data: {
          name: blogCategoryDto.name,
          tags: {
            set: blogCategoryDto.tags,
          },
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
    return {
      message: ResponseEnum.SUCCESS,
      status: HttpStatus.CREATED,
    };
  }

  async createBlogComment(
    blog_id: number,
    blogCommentDto: BlogCommentDto,
    req: any,
  ) {
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

      await this.prismaService.blog_comment.create({
        data: {
          comment: blogCommentDto.comment,
          blog_user: {
            connect: {
              id: req.user.id,
            },
          },
          blog_post: {
            connect: {
              id: blog_id,
            },
          },
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

  async likeDislike(blog_id: number, LikeDislikeDto: LikeDislikeDto, req: any) {
    try {
      const validLikeDislike =
        LikeDislikeDto.like === true && LikeDislikeDto.dislike === true;
      if (validLikeDislike) {
        throw new HttpException(
          "You can't like and dislike the post at the same time",
          HttpStatus.BAD_REQUEST,
        );
      }
      const [
        isExist_Blog,
        isLikeExist,
        isRemovedLikedPreviously,
        isDislikeExist,
        isExistLikeDislikeRecord,
      ] = await Promise.all([
        this.prismaService.blog_post.findUnique({
          where: {
            id: blog_id,
          },
        }),
        this.prismaService.blog_like_dislike.findFirst({
          where: {
            blog_post_id: blog_id,
            user_id: req.user.id,
            like: LikeDislikeDto.like == true,
            dislike: false,
          },
          select: {
            id: true,
            like: true,
          },
        }),
        this.prismaService.blog_like_dislike.findFirst({
          where: {
            blog_post_id: blog_id,
            user_id: req.user.id,
            like: false,
            dislike: false,
          },
        }),
        this.prismaService.blog_like_dislike.findFirst({
          where: {
            blog_post_id: blog_id,
            user_id: req.user.id,
            like: false,
            dislike: true,
          },
          select: {
            id: true,
            like: true,
          },
        }),
        this.prismaService.blog_like_dislike.findFirst({
          where: {
            blog_post_id: blog_id,
            user_id: req.user.id,
          },
        }),
      ]);

      console.log(
        `🚀 ~ BlogPostService ~         isExist_Blog,
        isLikeExist,
        isRemovedLikedPreviously,
        isDislikeExist,
        isExistLikeDislikeRecord, `,
        isLikeExist,
        isRemovedLikedPreviously,
        isDislikeExist,
        isExistLikeDislikeRecord,
      );

      if (isExistLikeDislikeRecord) {
        await this.prismaService.blog_like_dislike.update({
          where: {
            id: isExistLikeDislikeRecord.id,
          },
          data: {
            like: LikeDislikeDto?.like,
            dislike: LikeDislikeDto?.dislike,
          },
        });
        const responseLikeDislike =
          LikeDislikeDto.like === true
            ? 'You Liked The Post'
            : LikeDislikeDto.dislike === true
              ? 'you disliked the post'
              : 'You removed the like and dislike';
        return {
          message: ResponseEnum.SUCCESS,
          status: HttpStatus.CREATED,
          response: responseLikeDislike,
        };
      }

      switch (true) {
        case !isExist_Blog:
          throw new HttpException(ResponseEnum.NOT_FOUND, HttpStatus.NOT_FOUND);
        case isLikeExist && LikeDislikeDto.like === true:
          await this.prismaService.blog_like_dislike.update({
            where: {
              id: isLikeExist.id,
            },
            data: {
              like: LikeDislikeDto.like === true ? false : true,
            },
          });
          return {
            message: ResponseEnum.SUCCESS,
            status: HttpStatus.CREATED,
            response: 'You remove the liked',
          };
        case isLikeExist && LikeDislikeDto.dislike === true:
          await this.prismaService.blog_like_dislike.update({
            where: {
              id: isLikeExist.id,
            },
            data: {
              like: false,
              dislike: LikeDislikeDto.dislike,
            },
          });
          return {
            message: ResponseEnum.SUCCESS,
            status: HttpStatus.CREATED,
            response: 'You remove the liked and dislike the post',
          };

        case isDislikeExist && LikeDislikeDto.dislike === true:
          await this.prismaService.blog_like_dislike.update({
            where: {
              id: isRemovedLikedPreviously.id,
            },
            data: {
              like: false,
              dislike: LikeDislikeDto.dislike === true ? false : true,
            },
          });
          return {
            message: ResponseEnum.SUCCESS,
            status: HttpStatus.CREATED,
            response: 'You remove the disliked',
          };

        case isDislikeExist && LikeDislikeDto.like === true:
          await this.prismaService.blog_like_dislike.update({
            where: {
              id: isRemovedLikedPreviously.id,
            },
            data: {
              like: false,
              dislike: LikeDislikeDto.dislike === true ? false : true,
            },
          });
          return {
            message: ResponseEnum.SUCCESS,
            status: HttpStatus.CREATED,
            response: 'You remove the disliked and liked the post',
          };
        case isRemovedLikedPreviously &&
          isLikeExist === null &&
          isDislikeExist === null:
          await this.prismaService.blog_like_dislike.update({
            where: {
              id: isRemovedLikedPreviously.id,
            },
            data: {
              blog_post_id: blog_id,
              user_id: req.user.id,
              like: LikeDislikeDto?.like,
              dislike: LikeDislikeDto?.dislike,
            },
          });
          return {
            message: ResponseEnum.SUCCESS,
            status: HttpStatus.CREATED,
            response:
              LikeDislikeDto.like === true
                ? 'You Liked The Post'
                : 'You Disliked The Post',
          };
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all blogPost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blogPost`;
  }

  update(id: number, updateBlogPostDto: UpdateBlogPostDto) {
    console.log(
      '🚀 ~ BlogPostService ~ update ~ updateBlogPostDto:',
      updateBlogPostDto,
    );
    return `This action updates a #${id} blogPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} blogPost`;
  }
}
