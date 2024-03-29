import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/constants/enum';
export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
