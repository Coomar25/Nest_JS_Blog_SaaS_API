import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    title: 'Name',
    description: 'Name of the category',
    example: 'Technology',
  })
  @IsNotEmpty({
    message: 'Name is required',
  })
  @IsString({
    message: 'Name must be a string',
  })
  name: string;

  @ApiProperty({
    title: 'Tags',
    description: 'Tags of the category',
    example: ['Tech', 'Programming'],
  })
  @IsNotEmpty({
    message: 'Tags is required',
  })
  @IsArray({
    message: 'Tags must be an array',
  })
  @IsString({ each: true })
  tags: string[];

  @IsString({
    message: 'Slug must be a string',
  })
  slug: string;
}
