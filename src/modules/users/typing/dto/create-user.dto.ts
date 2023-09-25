import {
  IsString,
  IsInt,
  IsBoolean,
  IsEmail,
  Length,
  IsStrongPassword,
  // IsEnum,
  Min,
  Max,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
// import { Roles } from '../enums/roles.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  @Length(10, 30)
  password: string;

  @IsString()
  @Length(2, 20)
  firstName: string;

  @IsString()
  @Length(2, 20)
  lastName: string;

  @IsBoolean()
  @IsOptional()
  isMale?: boolean;

  @IsInt()
  @Min(18)
  @Max(150)
  @IsOptional()
  age?: number;

  @IsPhoneNumber('RU')
  @IsOptional()
  contactPhone?: string;

  // TODO? Нафига я тебя в ДТО запихал?..
  @IsString()
  @IsOptional()
  refreshToken?: string;

  // @IsEnum(Roles)
  // role: Roles;
}
