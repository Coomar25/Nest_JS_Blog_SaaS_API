import { ApiProperty } from '@nestjs/swagger';
import { blog_user } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/entity/base.entity';

export class AuthEntity extends BaseEntity implements blog_user {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Google Id',
    example: '1234567890',
  })
  google_id: string;

  @ApiProperty({
    description: 'Email',
    example: 'coomar24@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Name',
    example: 'Coomar',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Exclude()
  password: string;
  address: string;
  contact: string;
  user_profile: string;
  city: string;
  country: string;
  dob: string;
  postal: string;
  state: string;
}
