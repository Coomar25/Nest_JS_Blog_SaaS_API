import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ITokenSignFields } from 'src/auth/interface/token.interface';
import { Request } from 'express';

export type RequestWithUser = Request & { user: ITokenSignFields };

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ITokenSignFields => {
    const request: RequestWithUser = ctx.switchToHttp().getRequest();
    if (!request.user) {
      throw new Error('User not found');
    }
    console.log('🚀 ~ request.user:', request.user);
    return request.user;
  },
);
