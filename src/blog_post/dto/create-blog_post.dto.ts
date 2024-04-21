import { BlogPostStatus } from '@prisma/client';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateBlogPostDto {
  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  tags: string[];

  @IsNotEmpty()
  @IsString()
  status: BlogPostStatus;

  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @IsIn(['image/jpeg', 'image/png', 'application/pdf'])
  file: string;
}

export class BlogCatgoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export class BlogCommentDto {
  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  blog_id: number;
}

export class OrderByDto {
  @IsNotEmpty()
  @IsString()
  asc?: string;

  @IsNotEmpty()
  @IsString()
  desc?: string;
}

export class SubscribeBlogDto {
  @IsNotEmpty()
  @IsString()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  user_id: any;
}
