import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/entities/roles.decorator';
import { ResponseEnum, RoleEnum } from 'src/constants/enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Category This category is currently on maintenance mode. ')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  @Version('1')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({
    description: 'Create Category',
    summary: 'Create Category with Name',
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const slug = createCategoryDto.name.toLowerCase().replace(' ', '-');
    const isExist = await this.prismaService.blog_categories.findFirst({
      where: {
        slug,
      },
    });
    if (isExist) {
      return {
        statusCode: 400,
        message: 'Category already exist',
      };
    }
    return this.categoryService.create({ ...createCategoryDto, slug });
  }

  @Get()
  @ApiOperation({
    description: 'Get All Category',
    summary: 'Get All Category',
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: 404,
        exceptionFactory: () => new Error('Invalid ID'),
      }),
    )
    id: number,
  ) {
    const isExist = this.prismaService.blog_categories.findUnique({
      where: {
        id,
      },
    });
    if (!isExist) {
      return {
        statusCode: 404,
        message: ResponseEnum.NOT_FOUND,
      };
    }
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
