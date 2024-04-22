import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { random } from 'src/helper/random';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from 'src/constants/enum';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    try {
      return await this.prismaService.blog_user.create({
        data: {
          ...createAuthDto,
          deleted: false,
          role: RoleEnum.SUPERADMIN,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async googleLogin(req: any) {
    if (!req.user) {
      return {
        message: 'No user from google',
      };
    }
    const checkIsExist = await this.prismaService.blog_user.findUnique({
      where: {
        google_id: req.user.id,
        email: req.user.emails[0].value,
      },
    });
    if (!checkIsExist) {
      const randomPassword = random().randomPassword();
      let createGoogleUser: AuthEntity;
      if (!checkIsExist) {
        createGoogleUser = await this.prismaService.blog_user.create({
          data: {
            google_id: req.user.id,
            email: req.user._json.email,
            name: req.user._json.name,
            password: randomPassword,
            user_profile: req.user._json.picture,
          },
        });
      }

      const access_token = await this.jwtService.sign({
        id: checkIsExist ? checkIsExist.id : createGoogleUser.id,
        role: RoleEnum.USER,
      });
      return access_token;
    }
  }
}
