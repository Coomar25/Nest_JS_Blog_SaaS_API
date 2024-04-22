import { $Enums, blog_user, UserStatus } from '@prisma/client';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from 'src/common/entity/base.entity';

export class UserEntity extends BaseEntity implements blog_user {
  @IsOptional({})
  @IsString()
  google_id: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Exclude({ toPlainOnly: false })
  password: string;

  @IsString()
  address: string;

  @IsString()
  contact: string;

  @IsString()
  user_profile: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  dob: string;

  @IsString()
  postal: string;

  @IsString()
  state: string;

  @IsEnum($Enums.RoleEnum)
  role: $Enums.RoleEnum;

  @IsEnum(UserStatus, {
    message: `status must be a valid enum value: ${Object.values(UserStatus)}`,
  })
  status: UserStatus;

  deleted: boolean;
}
