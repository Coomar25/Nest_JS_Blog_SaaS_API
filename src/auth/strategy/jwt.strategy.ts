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
