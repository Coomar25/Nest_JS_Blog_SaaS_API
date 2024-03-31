import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseEnum, RoleEnum } from 'src/constants/enum';
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const isExist = await this.prismaService.blog_user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });
      console.log('🚀 ~ UserService ~ create ~ isExist:', isExist);
      if (isExist) {
        throw new HttpException('user already exist', HttpStatus.CONFLICT);
      }
      const dateofbirth = new Date(createUserDto.dob);
      console.log('🚀 ~ UserService ~ create ~ dateofbirth:', dateofbirth);
      const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);
      console.log(
        '🚀 ~ UserService ~ create ~ encryptedPassword:',
        encryptedPassword,
      );
      const createUser = await this.prismaService.blog_user.create({
        data: {
          email: createUserDto.email,
          address: createUserDto.address,
          city: createUserDto.city,
          contact: createUserDto.contact,
          country: createUserDto.country,
          dob: `${dateofbirth}`,
          name: createUserDto.name,
          postal: createUserDto?.postal,
          state: createUserDto?.state,
          user_profile: createUserDto?.user_profile,
          password: encryptedPassword,
        },
      });
      console.log('🚀 ~ UserService ~ create ~ createUser:', createUser);

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

      if (PasswordIsMatch) {
        const access_token = await this.jwtService.sign({
          id: isExist.id,
          role: RoleEnum.USER,
        });

        response.cookie('access_token', access_token, {
          httpOnly: true,
          secure: true,
        });

        return {
          message: ResponseEnum.SUCCESS,
          access: access_token,
        };
      } else {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
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
