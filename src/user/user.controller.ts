import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
  UseGuards,
  Version,
  Request,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserSignInDto } from './dto/signin-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/entities/roles.decorator';
import { RoleEnum } from 'src/constants/enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Version('1')
  @Roles(RoleEnum.USER, RoleEnum.ADMIN)
  @ApiBearerAuth('JWT')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('signin')
  callSignIn(
    @Body() userSignInDto: UserSignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.userService.user_signin(userSignInDto, response);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  @Version('1')
  callUserProfile(@Request() req: any) {
    return this.userService.user_profile(req);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
