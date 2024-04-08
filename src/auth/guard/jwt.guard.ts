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
      console.log(
        '🚀 ~ After token validation failed err occured here and unauthorized here:',
        err,
      );

      throw err || new UnauthorizedException();
    }

    if (user.id) {
      console.log('🚀 ~ After token validation success here ~ user:', user);
      return user;
    }
    throw err || new UnauthorizedException();
  }
}
