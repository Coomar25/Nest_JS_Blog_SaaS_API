import { Controller, Get, Post, UseGuards, Version } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminLoginDto } from './dto/login-admin.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/entities/roles.decorator';
import { RoleEnum } from 'src/constants/enum';
import { ApiBearerAuth } from '@nestjs/swagger';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Version('1')
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth('JWT')
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
