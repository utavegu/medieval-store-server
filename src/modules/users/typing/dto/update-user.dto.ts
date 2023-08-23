import {
  IsString,
  IsInt,
  IsBoolean,
  Length,
  // IsStrongPassword,
  Min,
  Max,
  IsPhoneNumber,
} from 'class-validator';

export class UpdateUserDto {
  // TODO: Пока уберу, там с паролем сложнее механизм должен быть на смену - также с хэшированием
  // @IsString()
  // @IsStrongPassword()
  // @Length(10, 30)
  // password?: string;

  @IsString()
  @Length(2, 20)
  firstName?: string;

  @IsString()
  @Length(2, 20)
  lastName?: string;

  @IsBoolean()
  isMale?: boolean;

  @IsInt()
  @Min(18)
  @Max(150)
  age?: number;

  @IsPhoneNumber('RU')
  contactPhone?: string;
}
