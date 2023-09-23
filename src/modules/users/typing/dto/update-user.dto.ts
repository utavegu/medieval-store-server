import {
  IsString,
  IsInt,
  IsBoolean,
  Length,
  // IsStrongPassword,
  Min,
  Max,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  // TODO: Пока уберу, там с паролем сложнее механизм должен быть на смену - также с хэшированием
  // @IsString()
  // @IsStrongPassword()
  // @Length(10, 30)
  // password?: string;

  @IsString()
  @Length(2, 20)
  @IsOptional()
  firstName?: string;

  @IsString()
  @Length(2, 20)
  @IsOptional()
  lastName?: string;

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

  // TODO: да, повод тебя запихать сюда был, компилер тс-а ругается. Но разберись всё ли тут правильно.
  @IsString()
  @IsOptional()
  refreshToken?: string | null;
}
