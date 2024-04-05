import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Socket } from 'socket.io';
import { configCredentials } from 'src/config/config';

@Injectable()
export class JwtSocketStrategy extends PassportStrategy(
  Strategy,
  'jwt-socket',
) {
  constructor() {
    super({
      jwtFromRequest: JwtSocketStrategy.extractJWT,
      ignoreExpiration: false,
      secretOrKey: configCredentials.JWTSECRET,
    });
  }

  private static extractJWT(socket: Socket): string | null {
    if (socket.data.token) {
      return socket.data.token;
    }
    return null;
  }

  async validate(payload: any) {
    // Here, you can perform additional validation or processing of the payload
    // If everything is valid, return the payload or a custom user object
    console.log('🚀 ~ JwtStrategy ~ validate ~ payload:', payload);
    return { id: payload.id, currentRole: payload.role };
  }
}
