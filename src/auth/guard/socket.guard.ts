import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
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
    //Extract the token from query

    if (token === undefined) {
      client.disconnect(true);
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

  //handle request runs if the token is invalid and throws error of unauthorized
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const client: Socket = context.switchToWs().getClient<Socket>();
    if (err || !user) {
      console.log(
        '🚀 ~ After token validation failed err occured in socket guards:',
        err,
      );
      client.disconnect(true);
      throw err || new UnauthorizedException();
    }

    if (user.id) {
      return user;
    }
    throw err || new UnauthorizedException();
  }
}
