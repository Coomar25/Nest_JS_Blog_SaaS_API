import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { configCredentials } from 'src/config/config';
import { JwtSocketStrategy } from './strategy/socket.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: configCredentials.JWTSECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtSocketStrategy],
})
export class AuthModule {}
