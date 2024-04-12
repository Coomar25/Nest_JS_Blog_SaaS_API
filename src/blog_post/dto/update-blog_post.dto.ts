import { PartialType } from '@nestjs/swagger';
import { BlogCatgoryDto, CreateBlogPostDto } from './create-blog_post.dto';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateBlogPostDto extends PartialType(CreateBlogPostDto) {}

export class UpdateBlogCategoryDto extends PartialType(BlogCatgoryDto) {}

export class IDParamDto {
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    {
      message: 'Invalid ID Please enter valid ID!',
      always: true,
    },
  )
  @IsNotEmpty({
    message: 'ID is required',
  })
  @IsPositive({
    message: 'Id of the user should not be negative',
  })
  id: number;
}
