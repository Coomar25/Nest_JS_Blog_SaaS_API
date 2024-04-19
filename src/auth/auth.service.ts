import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  create(createAuthDto: CreateAuthDto) {
    console.log('🚀 ~ AuthService ~ create ~ createAuthDto:', createAuthDto);
    return 'This action adds a new auth';
  }

  async googleLogin(req) {
    if (!req.user) {
      return {
        message: 'No user from google',
      };
    }
    return req.user;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    console.log('🚀 ~ AuthService ~ update ~ updateAuthDto:', updateAuthDto);
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
