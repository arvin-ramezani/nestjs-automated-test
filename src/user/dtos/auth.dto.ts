import { UserType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  // @Matches(/^(\d{4})$/, { message: 'Please Provide A Valid Phone Number' })
  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5, { message: 'Password Must Be At Least 5 Characters' })
  password: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  productKey?: string;
}

export class signinDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class generateProductKeyDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
