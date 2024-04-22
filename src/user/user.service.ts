import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseEnum, RoleEnum } from 'src/constants/enum';
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from 'src/email/email.service';
import { random } from 'src/helper/random';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserEntity } from './entities/user.entity';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private emailSerice: EmailService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const isExist = await this.prismaService.blog_user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });
      if (isExist) {
        throw new HttpException('user already exist', HttpStatus.CONFLICT);
      }
      const { randomPassword } = random();
      const non_encryptedPassword = randomPassword();
      console.log(
        '🚀 ~ UserService ~ create ~ non_encryptedPassword:',
        non_encryptedPassword,
      );
      const dateofbirth = new Date(createUserDto.dob);
      const encryptedPassword = await bcrypt.hash(non_encryptedPassword, 10);

      const createUser = await this.prismaService.blog_user.create({
        data: {
          email: createUserDto.email,
          address: createUserDto.address,
          city: createUserDto.city,
          contact: createUserDto.contact,
          country: createUserDto.country,
          dob: `${new Date(dateofbirth).toISOString().slice(0, 10)}`,
          name: createUserDto.name,
          postal: createUserDto?.postal,
          state: createUserDto?.state,
          user_profile: createUserDto?.user_profile,
          password: encryptedPassword,
        },
      });
      await this.emailSerice.sendUserWelcome(createUser, non_encryptedPassword);

      return {
        message: ResponseEnum.SUCCESS,
        status: HttpStatus.OK,
      };
    } catch (err) {
      console.log('🚀 ~ UserService ~ create ~ err:', err);
      throw new HttpException(
        `failed while creating users ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async user_signin(UserSignInDto: UserSignInDto, response: Response) {
    try {
      this.logger.info(`${UserSignInDto.email} is trying to signin`);
      const isExist = await this.prismaService.blog_user.findUnique({
        where: {
          email: UserSignInDto.email,
        },
        select: {
          id: true,
          password: true,
        },
      });
      if (!isExist) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const PasswordIsMatch = await bcrypt.compare(
        UserSignInDto.password,
        isExist.password,
      );
      console.log(
        '🚀 ~ UserService ~ user_signin ~ PasswordIsMatch:',
        PasswordIsMatch,
      );

      if (!PasswordIsMatch) {
        this.logger.error(
          `${UserSignInDto.email} is trying to login with wrong password`,
        );
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const access_token = this.jwtService.sign({
        id: isExist.id,
        role: RoleEnum.USER,
      });

      response.cookie('access_token', access_token, {
        httpOnly: true,
        secure: true,
      });
      this.logger.info({
        message: ` login ${ResponseEnum.SUCCESS} by ${UserSignInDto.email}`,
      });
      return {
        message: ResponseEnum.SUCCESS,
        access: access_token,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async user_profile(requestBody: any) {
    try {
      const isExist = await this.prismaService.blog_user.findUnique({
        where: {
          id: requestBody.user.id,
        },
        select: {
          id: true,
          email: true,
          address: true,
          city: true,
          contact: true,
          dob: true,
          country: true,
          name: true,
          user_profile: true,
          postal: true,
          state: true,
          _count: {
            select: {
              blogpost: true,
            },
          },
        },
      });
      if (!isExist) {
        throw new HttpException(ResponseEnum.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      return {
        message: ResponseEnum.SUCCESS,
        data: isExist,
      };
    } catch (err) {
      throw new HttpException(
        ResponseEnum.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    console.log('🚀 ~ UserService ~ update ~ updateUserDto:', updateUserDto);
    try {
      const isExistUser = await this.prismaService.blog_user.findUnique({
        where: {
          id,
        },
      });

      if (!isExistUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const encryptedPassword = await bcrypt.hash(updateUserDto.password, 10);

      await this.prismaService.blog_user.update({
        where: {
          id,
        },
        data: {
          name: updateUserDto.name ? updateUserDto.name : isExistUser.name,
          password: encryptedPassword
            ? encryptedPassword
            : isExistUser.password,
          address: updateUserDto.address
            ? updateUserDto.address
            : isExistUser.address,
          user_profile: updateUserDto.user_profile
            ? updateUserDto.user_profile
            : isExistUser.user_profile,
          city: updateUserDto.city ? updateUserDto.city : isExistUser.city,
          country: updateUserDto.country
            ? updateUserDto.country
            : isExistUser.country,
          dob: `${updateUserDto.dob ? updateUserDto.dob : isExistUser.dob}`,
          state: updateUserDto.state ? updateUserDto.state : isExistUser.state,
        },
      });
      return {
        message: ResponseEnum.SUCCESS,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsers() {
    try {
      const allUsers = await this.prismaService.blog_user.findMany({
        select: {
          email: true,
          name: true,
          address: true,
          contact: true,
          user_profile: true,
          city: true,
          country: true,
          dob: true,
          postal: true,
          state: true,
          _count: {
            select: {
              blogpost: true,
              blog_comment: true,
              blog_bookmarks: true,
              blog_total_viewed_post: true,
              blog_like_dislike: true,
            },
          },
        },
      });

      return {
        message: ResponseEnum.SUCCESS,
        status: HttpStatus.OK,
        data: allUsers,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async singleUsers(id: number) {
    try {
      const isExistUser = await this.prismaService.blog_user.findUnique({
        where: {
          id: +id,
        },
      });
      if (!isExistUser) {
        return {
          message: ResponseEnum.NOT_FOUND,
          status: HttpStatus.NOT_FOUND,
        };
      }
      return {
        message: ResponseEnum.SUCCESS,
        status: HttpStatus.OK,
        data: isExistUser,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   console.log('🚀 ~ UserService ~ update ~ updateUserDto:', updateUserDto);
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
