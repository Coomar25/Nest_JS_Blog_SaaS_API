import { blog_categories, Prisma } from '@prisma/client';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/entity/base.entity';

export class CategoryEntity extends BaseEntity implements blog_categories {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray({
    message: 'Tags must be an array',
  })
  @IsString({ each: true })
  tags: string[];

  @IsString()
  slug: string;
}
