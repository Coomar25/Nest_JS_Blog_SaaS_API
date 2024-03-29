# Nest js - Role based authentication with passport and jwt (RBAC)

RBAC in nest js

## Features:

- 🌟 Tech stack: NEST.JS POSTGRES PRISMA
- 📝 Learn type definitions and resolvers for defining GraphQL schema and data fetching logic
- 🔄 Mutations for modifying data in the GraphQL API and establishing graph relations
- 🔐 Authentication with Passport.js and MongoDB session store
- 🚀 Global state management with Apollo Client
- 🐞 Error handling both on the server and on the client
- ⭐ Deployment made easy with a platform called Render
- 👾 Cron jobs for scheduled tasks and automation
- ⏳ And much more!

# BACKEND DEPENDENCIES

```bash
npm install @nestjs/passport @nestjs/jwt passport-jwt class-validator
```

# Create three app i.e auth, user and admin

```bash
 nest generate resource user --no-spec
 nest generate resource auth --no-spec
 nest generate resource admin --no-spec
```

# CREATE A jwt.stratefy.ts file and add the following code

```bash
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { configCredentials } from 'src/config/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configCredentials.JWTSECRET,
    });
  }

  async validate(payload: any) {
    console.log('🚀 ~ JwtStrategy ~ validate ~ payload:', payload);
    return { id: payload.id, currentRole: payload.role };
  }
}
```

# Register the JwtStrategy into AuthModule providers

```bash
# Before
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}


# After use below code

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'add your secret key here that is hard to decode',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}


```

# CREATE THE AUTH DTO

```bash
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
```

# CREATE SIGNIN FUNCTIONALITY WHICH RESPONDE JWT TOKEN USING ONE SECRET KEY

# THIS IS BASIC SIGNIN FUNCTIONALITY WHICH ONLY RESPONSE TOKEN USING THE JWT SERCIVE

```
//YOU CAN PASTE ENTIRE CODE
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
      const access_token = await this.jwtService.sign(payload);
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

```

# FOR TO USE THE JWTSERVICE WE MUST NEED TO IMPORT THE JWTMODULE WHERE ARE GOING TO USE THAT SERVICE

# YOU CAN SEE EXAMPLE BELOW WE IMPORT THE JWT MODULE IN ADMIN MODULE AS YOU CAN SEE IN PREVIOUS AUTH MODULE THERE TOO WE IMPORT THE JWT MODULE

```
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { configCredentials } from 'src/config/config';

@Module({
  imports: [
    JwtModule.register({
      secret: configCredentials.JWTSECRET, // Replace with your actual secret key
      signOptions: { expiresIn: '1h' }, // Example options, adjust as needed
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}



```
