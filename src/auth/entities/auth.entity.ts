import { ApiProperty } from '@nestjs/swagger';
import { $Enums, blog_user } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
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

  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({
    description: 'Address',
    example: 'Kolkata',
  })
  address: string;

  @ApiProperty({
    description: 'Contact',
    example: '9876543210',
  })
  contact: string;

  @ApiProperty({
    description: 'User Profile',
    example: 'https://www.google.com',
  })
  user_profile: string;

  @ApiProperty({
    description: 'City',
    example: 'Kolkata',
  })
  city: string;

  @ApiProperty({
    description: 'Country',
    example: 'India',
  })
  country: string;

  @ApiProperty({
    description: 'Date of Birth',
    example: '1996-08-24',
  })
  dob: string;

  @ApiProperty({
    description: 'Postal',
    example: '700001',
  })
  postal: string;

  @ApiProperty({
    description: 'State',
    example: 'WB',
  })
  state: string;

  @IsEnum($Enums.RoleEnum)
  @IsNotEmpty()
  role: $Enums.RoleEnum;

  @IsEnum($Enums.UserStatus)
  status: $Enums.UserStatus;

  @ApiProperty({
    description: 'Is Deleted',
    example: false,
  })
  deleted: boolean;
}
