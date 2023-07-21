import { ID } from 'src/typing/types/id';
import { JwtPayload } from './JwtPayload';
import { IJwtTokens } from './IJwtTokens';
import { CreateUserDto } from 'src/modules/users/typing/dto/create-user.dto';
import { AuthDto } from '../dto/auth.dto';
import { User } from 'src/modules/users/schemas/user.schema';

export interface IAuthService {
  getTokens(payload: JwtPayload): Promise<IJwtTokens>;
  updateRefreshToken(userId: ID, refreshToken: string): Promise<void>;
  refreshTokens(userId: string, refreshToken: string): Promise<IJwtTokens>;
  signUp(createUserDto: CreateUserDto): Promise<IJwtTokens>;
  signIn(loginData: AuthDto): Promise<IJwtTokens>;
  logout(userId: string): Promise<User>;
}
