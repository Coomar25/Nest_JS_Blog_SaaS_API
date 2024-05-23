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
  @IsNotEmpty({
    message: 'Title is required',
  })
  @IsString({
    message: 'Title must be a string',
  })
  title: string;

  @IsNotEmpty({
    message: 'Description is required',
  })
  @IsString()
  description: string;

  @IsNotEmpty({
    message: 'Tags is required',
  })
  @IsArray({
    message: 'Tags must be an array',
  })
  tags: string[];

  @IsNotEmpty({
    message: 'Content is required',
  })
  @IsString({
    message: 'Content must be a string',
  })
  status: BlogPostStatus;

  @IsNotEmpty({
    message: 'Author id is required',
  })
  @IsNumber()
  authorId: number;

  @IsNotEmpty({
    message: 'Category id is required',
  })
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
