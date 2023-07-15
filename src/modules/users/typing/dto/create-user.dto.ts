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
  isMale?: boolean;

  @IsInt()
  @Min(18)
  @Max(150)
  age?: number;

  @IsPhoneNumber('RU')
  contactPhone?: string;

  // @IsEnum(Roles)
  // role: Roles;
}
