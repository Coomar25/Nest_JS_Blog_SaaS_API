import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseEnum } from 'src/constants/enum';

@ApiTags('Super-Admin and User Google Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  @Get('google')
  @ApiResponse({
    description: 'Google Auth by the user',
  })
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    description: 'Google Auth',
    summary: 'Google Auth for the user',
  })
  async googleAuth(@Req() req) {
    console.log('🚀 ~ AuthController ~ req:', req);
  }

  @Get('redirect/google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    description: 'Google Auth Redirect to the user',
    summary: 'Google Auth Redirect after successful login',
  })
  async googleAuthRedirect(@Req() req: Request) {
    return this.authService.googleLogin(req);
  }

  @ApiResponse({
    description: 'For creating the super admin',
  })
  @ApiOperation({
    description: 'Create Super Admin',
    summary: 'Create Super Admin with Email and Password',
  })
  @Post()
  async create(@Body() createAuthDto: CreateAuthDto) {
    try {
      const isExist = await this.prismaService.blog_user.findUnique({
        where: {
          email: createAuthDto.email,
        },
      });
      if (isExist) {
        return {
          message: ResponseEnum.CONFLICT,
          inbox: 'User with that email already exist',
        };
      }
      return await this.authService.create(createAuthDto);
    } catch (err) {
      throw new InternalServerErrorException(`${err.message}`);
    }
  }
}
