import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import { User } from 'src/modules/users/schemas/user.schema';

export class AuthDto {
  @IsEmail()
  email: User['email'];

  @IsString()
  @IsStrongPassword()
  @Length(10, 30)
  password: User['passwordHash'];
}
