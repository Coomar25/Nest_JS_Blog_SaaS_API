import { $Enums, blog_post } from '@prisma/client';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/entity/base.entity';

export class BlogEntity extends BaseEntity implements blog_post {
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
  @IsString()
  cover_image: string;
  @IsArray()
  @IsString()
  tags: string[];
  status: $Enums.BlogPostStatus;
  authorId: number;
  category_id: number;
}
