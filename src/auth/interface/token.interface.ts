import { RoleEnum } from '@prisma/client';

export interface ITokenSignFields {
  id: number;
  role: RoleEnum;
}
