import { Param } from '@nestjs/common';
import { BlogPostStatus } from '@prisma/client';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
