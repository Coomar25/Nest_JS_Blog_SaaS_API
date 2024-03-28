# GraphQL Crash Course - Build an Expense Tracker App

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
npm install @nestjs/passport passport-jwt
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

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'add your secret key here that is hard to decode',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```

# Register the JwtStrategy into auth providers

```bash

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

```
