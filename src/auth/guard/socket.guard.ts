import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { ResponseEnum } from 'src/constants/enum';

@Injectable()
export class JwtSocketGuard extends AuthGuard('jwt-socket') {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token: string | string[] = client.handshake.query.token;
    console.log(
      '🚀 ~ JwtSocketGuard ~ classJwtSocketGuardextendsAuthGuard ~ context, token:',
      context,
    ); //Extract the token from query

    if (token === undefined) {
      throw new HttpException(
        ResponseEnum.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const authtoken: string = Array.isArray(token) ? token[0] : token;
    client.data.token = authtoken;
    // Pass the token to Passport for validation

    return super.canActivate(context);
  }
}
