import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto implements Prisma.blog_userCreateInput {
  @IsString({
    message: 'Name must be a string',
  })
  @IsNotEmpty({
    message: 'Name is required',
  })
  @ApiProperty({
    description: 'Name',
    example: 'Coomar',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'kumarbhetwal25@gmail.com',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password',
    example: 'password',
  })
  readonly password: string;

  @IsString()
  @ApiProperty({
    description: 'Google Id',
    example: '1234567890',
  })
  google_id: string;

  @ApiProperty({
    description: 'Address',
    example: 'Kathmandu',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Contact',
    example: '9876543210',
  })
  @IsString()
  contact: string;

  @ApiProperty({
    description: 'User Profile',
    example: 'https://www.google.com',
  })
  @IsString()
  user_profile: string;

  @ApiProperty({
    description: 'City',
    example: 'Kathmandu',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Country',
    example: 'Nepal',
  })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Date of Birth',
    example: '1996-08-24',
  })
  @IsString()
  dob: string;

  @ApiProperty({
    description: 'Postal',
    example: '44600',
  })
  @IsString()
  postal: string;

  @ApiProperty({
    description: 'State',
    example: 'Bagmati',
  })
  @IsString()
  state: string;

  @IsEnum($Enums.UserStatus)
  status: $Enums.UserStatus;
}
