import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  BlogCatgoryDto,
  BlogCommentDto,
  CreateBlogPostDto,
} from './dto/create-blog_post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseEnum, RoleEnum } from 'src/constants/enum';
import { LikeDislikeDto } from './dto/like-dislike-post.dto';
import { BlogPostStatus } from '@prisma/client';
import { UpdateBlogCategoryDto } from './dto/update-blog_post.dto';
import { BlogEntity } from './entities/blog.entity';

@Injectable()
export class BlogPostService {
  constructor(private prismaService: PrismaService) {}

  async createBlogCategory(blogCategoryDto: BlogCatgoryDto) {
    try {
      const isExist = await this.prismaService.blog_categories.findFirst({
        where: {
          name: blogCategoryDto.name,
        },
      });

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

  async updateBlogCategory(
    blog_id: number,
    updateCategory: UpdateBlogCategoryDto,
  ) {
    try {
      const isExist_Blog = await this.prismaService.blog_categories.findUnique({
        where: {
          id: blog_id,
        },
      });
      if (!isExist_Blog) {
        return {
          message: ResponseEnum.NOT_FOUND,
          status: HttpStatus.NOT_FOUND,
        };
      }

      await this.prismaService.blog_categories.update({
        where: {
          id: +blog_id,
        },
        data: {
          name: updateCategory.name,
          tags: {
            set: updateCategory.tags,
          },
        },
      });

      return {
        message: ResponseEnum.SUCCESS,
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new HttpException(
        ResponseEnum.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createBlogPostDto: CreateBlogPostDto, req: any, file: any): Promise<BlogEntity> {
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
              id: +req.user.id,
            },
          }),
          this.prismaService.blog_categories.findUnique({
            where: {
              id: +createBlogPostDto.category_id,
            },
          }),
        ],
      );

      console.log(
        `type of tags is ${(createBlogPostDto.tags, typeof createBlogPostDto.tags)}`,
      );

      const checkIfIsArray = Array.isArray(createBlogPostDto.tags);
      if (!checkIfIsArray) {
        throw new HttpException(
          'Tags should be an array',
          HttpStatus.BAD_REQUEST,
        );
      }

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

      return await this.prismaService.blog_post.create({
        data: {
          slug: createBlogPostDto.slug,
          title: createBlogPostDto.title,
          description: createBlogPostDto.description,
          tags: createBlogPostDto.tags,
          cover_image: file.filename ? file.filename : null,
          status:
            req.user.currentRole === RoleEnum.ADMIN
              ? BlogPostStatus.PUBLISHED
              : BlogPostStatus.PENDING,
          blog_categories: {
            connect: {
              id: Number(isValid_categoryId.id),
            },
          },
          blog_user: {
            connect: {
              id: Number(isValid_authorId.id),
            },
          },
        },
      });

   
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createBlogComment(
    blog_id: number,
    blogCommentDto: BlogCommentDto,
    req: any,
  ) {
    try {
      const isExist = await this.prismaService.blog_post.findUnique({
        where: {
          id: +blog_id,
        },
      });
      console.log(
        '🚀 ~ BlogPostService ~ isExist:',
        isExist,
        typeof req.user.id,
        typeof blog_id,
      );
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
              id: +blog_id,
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
      if (LikeDislikeDto.like === true && LikeDislikeDto.dislike === true) {
        const existingLikeORDislike =
          await this.prismaService.blog_like_dislike.findFirst({
            where: {
              blog_post_id: blog_id,
              user_id: req.user.id,
            },
          });
        const recordWithBothFalse =
          await this.prismaService.blog_like_dislike.findFirst({
            where: {
              blog_post_id: blog_id,
              user_id: req.user.id,
              like: false,
              dislike: false,
            },
          });
        if (
          recordWithBothFalse &&
          LikeDislikeDto.like === true &&
          LikeDislikeDto.dislike === true
        ) {
          return {
            message: "You can't like and dislike the post at the same time",
            status: HttpStatus.NOT_ACCEPTABLE,
          };
        }
        if (existingLikeORDislike) {
          switch (true) {
            case existingLikeORDislike.like === true:
              await this.prismaService.blog_like_dislike.update({
                where: {
                  id: existingLikeORDislike.id,
                },
                data: {
                  like: false,
                  dislike: LikeDislikeDto.dislike,
                },
              });
              return {
                message: ResponseEnum.SUCCESS,
                status: HttpStatus.ACCEPTED,
                response: 'You remove the like and dislike the post',
              };
            case existingLikeORDislike.dislike === true:
              await this.prismaService.blog_like_dislike.update({
                where: {
                  id: existingLikeORDislike.id,
                },
                data: {
                  like: LikeDislikeDto.like,
                  dislike: false,
                },
              });
              return {
                message: ResponseEnum.SUCCESS,
                status: HttpStatus.ACCEPTED,
                response: 'You remove the dislike and liked the post',
              };
          }
        }
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
            like: true,
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
        }),
        this.prismaService.blog_like_dislike.findFirst({
          where: {
            blog_post_id: blog_id,
            user_id: req.user.id,
          },
        }),
      ]);

      console.log(
        `isLikeExist ${isLikeExist} isRemovedLikedPreviously ${isRemovedLikedPreviously} isDislikeExist ${isDislikeExist !== null} isExistLikeDislikeRecord ${isExistLikeDislikeRecord !== null} isExist_Blog ${isExist_Blog !== null}`,
      );

      console.log(
        '🚀 ~ BlogPostService ~ likeDislike ~ isRemovedLikedPreviously:',
        isRemovedLikedPreviously,
      );

      switch (true) {
        case !isExist_Blog:
          throw new HttpException(ResponseEnum.NOT_FOUND, HttpStatus.NOT_FOUND);
        case !isExistLikeDislikeRecord:
          await this.prismaService.blog_like_dislike.create({
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
        case isLikeExist !== null && LikeDislikeDto.like === true:
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
          try {
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
          } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
          }

        case isDislikeExist && LikeDislikeDto.dislike === true:
          try {
            await this.prismaService.blog_like_dislike.update({
              where: {
                id: isDislikeExist.id,
              },
              data: {
                like: false,
                dislike: false,
              },
            });

            return {
              message: ResponseEnum.SUCCESS,
              status: HttpStatus.CREATED,
              response: 'You remove the disliked',
            };
          } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
          }

        case isDislikeExist && LikeDislikeDto.like === true:
          try {
            await this.prismaService.blog_like_dislike.update({
              where: {
                id: isDislikeExist.id,
              },
              data: {
                like: true,
                dislike: false,
              },
            });

            return {
              message: ResponseEnum.SUCCESS,
              status: HttpStatus.CREATED,
              response: 'You liked the blog post',
            };
          } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
          }

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
        default:
          break;
      }

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
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async allBlogPost() {
    try {
      const blogData = await this.prismaService.blog_post.findMany({
        where: {
          status: BlogPostStatus.PUBLISHED,
        },
        select: {
          id: true,
          title: true,
          description: true,
          cover_image: true,
          tags: true,
          status: true,
          blog_user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          blog_categories: {
            select: {
              id: true,
              name: true,
            },
          },
          blog_like_dislike: {
            where: {
              OR: [
                {
                  like: true,
                },
                {
                  dislike: true,
                },
              ],
            },
            select: {
              id: true,
              like: true,
              dislike: true,
            },
          },
          blog_comment: {
            select: {
              id: true,
              comment: true,
              userId: true,
              blog_id: true,
              creaedAt: true,
              updatedAt: true,
            },
          },
          _count: {
            select: {
              blog_comment: true,
              blog_bookmarks: true,
              blog_like_dislike: {
                where: {
                  like: true,
                },
              },
              blog_total_viewed_post: true,
            },
          },
        },
      });

      if (blogData.length === 0) {
        return {
          message: ResponseEnum.NOT_FOUND,
          status: HttpStatus.NOT_FOUND,
        };
      }

      return {
        message: ResponseEnum.SUCCESS,
        status: HttpStatus.OK,
        data: blogData,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
