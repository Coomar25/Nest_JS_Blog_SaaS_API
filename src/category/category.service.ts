import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prismaService.blog_categories.create({
      data: createCategoryDto,
    });
  }

  async findAll() {
    return await this.prismaService.blog_categories.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.blog_categories.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} ${updateCategoryDto} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
