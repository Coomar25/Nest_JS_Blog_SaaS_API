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
    console.log(
      '🚀 ~ JwtAuthGuard ~ classJwtAuthGuardextendsAuthGuard ~ context:',
      context,
    );

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
