import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminLoginDto } from './dto/login-admin.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('signup')
  async callSignUp(createAdminDto: CreateAdminDto) {
    return this.adminService.signup(createAdminDto);
  }

  @Post('signin')
  async callSignIn(adminLoginDto: AdminLoginDto) {
    return this.adminService.signin(adminLoginDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.adminService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.adminService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.adminService.update(+id, updateAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.adminService.remove(+id);
  // }
}
