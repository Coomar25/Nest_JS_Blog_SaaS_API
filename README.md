# Nest js - Role based authentication with passport and jwt (RBAC)

RBAC in nest js
// "start": "concurrently \"nest start\" \"npx prisma studio\"",

## Features:

- 🌟 Tech stack: NEST.JS POSTGRES PRISMA
<!-- - 📝 Learn type definitions and resolvers for defining GraphQL schema and data fetching logic
- 🔄 Mutations for modifying data in the GraphQL API and establishing graph relations -->
- 🔐 Authentication with Passport.js and JWT and RBAC
  <!-- - 🚀 Global state management with Apollo Client -->
  <!-- - 🐞 Error handling both on the server and on the client -->
  <!-- - ⭐ Deployment made easy with a platform called Render -->
  <!-- - 👾 Cron jobs for scheduled tasks and automation -->
- ⏳ And much more!

# BACKEND DEPENDENCIES

```bash
npm install @nestjs/passport @nestjs/jwt passport-jwt class-validator
```

## Create three app i.e auth, user and admin

```bash
 nest generate resource user --no-spec
 nest generate resource auth --no-spec
 nest generate resource admin --no-spec
```

## Create a jwt.guard.ts files inside the auth/guard/ path and paste the following code

```
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    // info: any,
    // context: ExecutionContext,
    // status?: any,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    console.log(
      '🚀 ~ JwtAuthGuard ~ classJwtAuthGuardextendsAuthGuard ~ user:',
      user,
    );

    if (user.id) {
      return user;
    }
    throw err || new UnauthorizedException();
  }
}

```

This code defines a NestJS guard called JwtAuthGuard which extends AuthGuard from @nestjs/passport. Guards in NestJS are used to control access to routes and resources based on certain conditions.

Here's a breakdown of what this code does:

Imports: It imports necessary modules and classes from @nestjs/common, @nestjs/passport, and rxjs.

Class Definition: The JwtAuthGuard class is defined as an Injectable (@Injectable()), indicating that NestJS should manage its lifecycle.

Constructor: The constructor is defined but doesn't do anything other than calling super(), which calls the constructor of the parent class (AuthGuard).

canActivate Method Override: This method overrides the canActivate method inherited from AuthGuard. This method is responsible for determining whether the incoming request should be allowed to proceed. In this implementation, it simply calls the canActivate method of the parent class (super.canActivate(context)), which is provided by AuthGuard.

handleRequest Method Override: This method also overrides a method inherited from AuthGuard. It handles the result of the authentication attempt. In this implementation:

If there is an error (err) or the user object is falsy, it throws either the error or a new UnauthorizedException.
Otherwise, it logs the user object.
Finally, it checks if the user object has an id property. If it does, it returns the user object. If not, it throws an UnauthorizedException.
Overall, this JwtAuthGuard class is meant to be used with routes or controllers to protect them using JWT (JSON Web Token) authentication. It checks for the presence of a valid JWT token and ensures that the user object extracted from the token contains an id property before allowing access to the protected resource. If authentication fails or the user object is invalid, it throws an UnauthorizedException.

## CREATE A jwt.stratefy.ts file inside the auth/strategy/ path and add the following code

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

Here the the jwt strategy run before guard in which the validate method automatically validate the jwt token and returns the decoded token
if we need to use the JwtStrategy in any module we need to import the JwtModule look below code we implemented jwt strategy in auth/strategy folders

This code defines a Passport strategy for JWT (JSON Web Token) authentication in a NestJS application. Passport is a popular authentication middleware for Node.js applications.

Here's an explanation of what this code does:

Imports: It imports necessary modules and classes from passport-jwt, @nestjs/passport, @nestjs/common, and a configCredentials object from the application's configuration.

Class Definition: The JwtStrategy class is defined as an Injectable (@Injectable()), indicating that NestJS should manage its lifecycle. It extends PassportStrategy(Strategy), which is a base class provided by @nestjs/passport for creating custom authentication strategies.

Constructor: The constructor of JwtStrategy is defined. It calls the constructor of the parent class (super) with an object containing configuration options for the JWT strategy:

jwtFromRequest: Specifies how the JWT should be extracted from the incoming request. In this case, it's extracted from the Authorization header as a bearer token (fromAuthHeaderAsBearerToken()).
ignoreExpiration: Indicates whether to ignore expiration checks on the JWT.
secretOrKey: Specifies the secret (or key) used to sign the JWT. This is typically retrieved from application configuration (configCredentials.JWTSECRET).
validate Method Override: This method overrides the validate method inherited from PassportStrategy. It is called when a JWT has been successfully validated and decoded. In this implementation:

It logs the decoded payload.
It returns an object with specific properties extracted from the payload (id and role). This object will be attached to the request object and can be accessed downstream in the route handlers.
Usage: To use the JwtStrategy in any module, you need to import JwtModule from @nestjs/jwt. The JwtModule should be configured with the appropriate secret, which is provided by configCredentials.JWTSECRET.

Overall, this JwtStrategy class is responsible for validating JWT tokens extracted from incoming requests. It extracts the necessary information from the token's payload and provides it for further processing by the application.

## Register the JwtStrategy into AuthModule providers which is inside the auth/auth.module.ts files

For to use the the JwtStrategy in any nest app you need to import the JwtModule

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


# Look in below code we import the JWt Module

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

## Create the file create-auth.dto.ts file inside auth/dto/create-auth.dto.ts ...path or any others based on your requirements (Optional for now as we are only generating the access token also apart there no any crud operation we are performing right know)

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

## CREATE BASIC SIGNIN FUNCTIONALITY WHICH RESPONDE JWT TOKEN USING ONE SECRET KEY

This code snippet represents basic sign-in functionality that only responds with a token using the JWT service.

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

Here your server will crash since we are not registering the JwtService inside the [nest admin app i.e {src/admin directory}] which was created before. The error occured because we are importing the JwtService in admin.service.ts but not registering inside the AdminModule

## FOR TO USE THE JWTSERVICE WE MUST NEED TO IMPORT THE JWTMODULE WHERE ARE GOING TO USE THAT SERVICE

In the example below, we import the jwt module in the admin module. Similarly, in the previous auth module, we also import the jwt module.

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

## Add the following in any admin routes

```
 @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.adminService.findAll();
  }
```

hit the admin routes when you hit you will be regarded as unauthorized you will need token to access the routes

## Up unitl know we only implement the jwt token authentication, still the roles based access control is remaining

create the files inside the auth/entities/roles.decorators.ts file and paste the below code

```
import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/constants/enum';
export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);

```

create the roles.guard.ts files inside the auth/guard/role.guard.ts files and paste the following code please fixes bugs as while implementing this docs i implemented and fixes the issues

```
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleEnum } from 'src/constants/enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // what are the required roles to access this route
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    console.log('🚀 ~ requiredRoles ~ user:', requiredRoles);

    // if the role is not assigned to the route which is in controller then allow access
    if (!requiredRoles) {
      return true;
    }
    //from the request get the id and currentRole of the user who is trying to access the route. The id and currentRole is set in the validate method of JwtStrategy which runs first and then this guard runs to check the role of the user.

    const { user } = context.switchToHttp().getRequest();
    console.log('🚀 ~ RolesGuard ~ user:', user);

    // if the user has the required role validate the role and allow access
    const validateIncommingRole = requiredRoles.some((roles) =>
      user.currentRole.includes(roles),
    );
    if (validateIncommingRole) {
      return true;
    }
  }
}
```

## Create the roles.decorator.ts files inside the auth/entities/roles.decorator.ts files and paste the following code

```
import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/constants/enum';
export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);

```
