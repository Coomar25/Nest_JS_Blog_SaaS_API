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
