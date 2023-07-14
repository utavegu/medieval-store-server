import {
  IsString,
  IsInt,
  IsBoolean,
  IsEmail,
  Length,
  IsStrongPassword,
  IsMobilePhone,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Roles } from '../enums/roles.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  passwordHash: string;

  @IsString()
  @Length(2, 20)
  firstName: string;

  @IsString()
  @Length(2, 20)
  lastName: string;

  @IsBoolean()
  isMale: boolean;

  @IsInt()
  @Min(18)
  @Max(150)
  age: number;

  @IsMobilePhone('ru-RU')
  contactPhone: string;

  @IsEnum(Roles)
  role: Roles;
}
