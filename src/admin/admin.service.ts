import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginDto } from './dto/login-admin.dto';

@Injectable()
export class AdminService {
  constructor(private jwtService: JwtService) {}
  async signup(createAdminDto: CreateAdminDto) {
    console.log('🚀 ~ AdminService ~ signup ~ createAdminDto:', createAdminDto);
    return 'This action adds a new admin';
  }

  async signin(adminLoginDto: AdminLoginDto) {
    console.log('🚀 ~ AdminService ~ signin ~ adminLoginDto:', adminLoginDto);
    try {
      console.log('🚀 ~ AdminService ~ singin ~ adminLoginDto:', adminLoginDto);
      const payload = { id: 1, role: 'Admin' };
      const access_token = this.jwtService.sign(payload);
      return {
        access_token,
      };
    } catch (err) {
      console.log(err);
    }
  }

  findAll() {
    return {
      message: 'i am fetchning all the admins data buddy',
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} admin`;
  // }

  // update(id: number, updateAdminDto: UpdateAdminDto) {
  //   return `This action updates a #${id} admin`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} admin`;
  // }
}
