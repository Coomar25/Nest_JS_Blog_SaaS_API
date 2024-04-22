import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    title: 'Email',
    description: 'Email of the user',
    example: 'kumarbhetwal25@gmail.com',
  })
  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsString({
    message: 'Email must be a string',
  })
  @IsEmail({
    // allow_ip_domain: Specifies whether IP addresses are allowed as the domain part of the email. If set to true, email addresses like user@[IPv6:2001:DB8::1] would be considered valid. If set to false, IP addresses are not allowed in the domain part.
    allow_ip_domain: false,
    // allow_utf8_local_part: Determines whether UTF-8 characters are allowed in the local part of the email address (before the '@' symbol). If set to true, characters such as emojis or accented characters are allowed. If set to false, only ASCII characters are allowed.
    allow_utf8_local_part: true,
    // require_tld: Specifies whether a top-level domain (TLD) is required in the email address. If set to true, the email address must have a TLD such as .com, .org, etc. If set to false, the TLD is not mandatory.
    require_tld: true,

    ignore_max_length: false,
  })
  email: string;

  @ApiProperty({
    title: 'Name',
    description: 'Name of the user',
    example: 'Kumar Bhetwal',
  })
  @IsNotEmpty({
    message: 'Name is required',
  })
  @IsString({
    message: 'Name must be a string',
  })
  name: string;

  @ApiProperty({
    title: 'Passsword',
    description:
      'Password of the user must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
    example: 'Kumar@1234',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Password too weak',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    title: 'Address',
    description: 'Address of the user',
    additionalProperties: {
      type: 'string',
    },
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    title: 'Contact',
    description: 'Contact of the user',
    example: '9843667203',
  })
  @Matches(/^\+[1-9]{1}[0-9]{1,2}[0-9]{10}$/, {
    message: 'Contact must be a 10 digit numnber',
  })
  @IsNotEmpty()
  @IsString()
  contact: string;

  @ApiProperty({
    title: 'User Profile',
    description: 'User Profile of the user',
    example: 'https://www.google.com',
  })
  @IsNotEmpty()
  @IsString()
  user_profile?: string;

  @IsNotEmpty({
    message: 'City is required',
  })
  @IsString({
    message: 'City must be a string',
  })
  @ApiProperty({
    title: 'City',
    description: 'City of the user',
    example: 'Kathmandu',
  })
  city: string;

  @IsNotEmpty({
    message: 'Country is required',
  })
  @IsString({
    message: 'Country must be a string',
  })
  @ApiProperty({
    title: 'Country',
    description: 'Country of the user',
    example: 'Nepal',
  })
  country: string;

  @IsNotEmpty({
    message: 'Date of Birth is required',
  })
  @IsDate({
    message: 'Date of Birth must be a date',
  })
  @ApiProperty({
    title: 'Date of Birth',
    description: 'Date of Birth of the user',
    example: '1996-08-24',
  })
  dob: Date;

  @IsNotEmpty({
    message: 'Postal is required',
  })
  @IsString({
    message: 'Postal must be a string',
  })
  @ApiProperty({
    title: 'Postal',
    description: 'Postal of the user',
    example: '44600',
  })
  postal?: string;

  @IsNotEmpty({
    message: 'State is required',
  })
  @IsString({
    message: 'State must be a string',
  })
  @ApiProperty({
    title: 'State',
    description: 'State of the user',
    example: 'Bagmati',
  })
  state: string;
}
