import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/typing/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
import { AuthDto } from './typing/dto/auth.dto';
import { ID } from 'src/typing/types/id';
import { comparePasswords, encryptPassword } from 'src/helpers/encrypting';
import { JwtPayload } from './typing/interfaces/JwtPayload';
import { UserWithId } from './typing/types/UserWithId';
import { IJwtTokens } from './typing/interfaces/IJwtTokens';
import { User } from '../users/schemas/user.schema';
import { IAuthService } from './typing/interfaces/IAuthService';
import { JWT } from 'src/constants';

// !!! TODO !!! Ещё тут порефакторить можно неплохо. Но всё это - когда уже готовая фронтенд-часть аутентификации будет готова

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  // private configService: ConfigService, // было выше

  async getTokens(payload: JwtPayload): Promise<IJwtTokens> {
    const { sub, email, role } = payload;
    // TODO: Тут тоже, вполне, можно сделать единую функцию с разными аргами ради DRY
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub,
          email,
          role,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET, // this.configService.get<string>('JWT_ACCESS_SECRET'), TODO
          expiresIn: `${JWT.ACCESS_TOKEN_EXPIRES_IN_MINUTES}m`,
        },
      ),
      this.jwtService.signAsync(
        {
          sub,
          email,
          role,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET, // this.configService.get<string>('JWT_REFRESH_SECRET'), TODO
          expiresIn: `${JWT.REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: ID, refreshToken: string): Promise<void> {
    // const hashedRefreshToken = await this.hashData(refreshToken);
    // TODO: Тут нужно будет усложнить логику, когда можно будет логиниться из нескольких мест (браузеров, устройств, айпишников...). Также нужно будет продумать механизм, удаляющий протухшие токены из базы данных.
    const hashedRefreshToken = await encryptPassword(refreshToken);
    await this.usersService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshTokens(userId: ID, refreshToken: string): Promise<IJwtTokens> {
    const user = await this.usersService.findUserById(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    // const refreshTokenMatches = await argon2.verify(
    //   user.refreshToken,
    //   refreshToken,
    // );
    const refreshTokenMatches = await comparePasswords(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens({
      sub: (user as UserWithId).id,
      email: user.email,
      role: user.role,
    });

    await this.updateRefreshToken((user as UserWithId).id, tokens.refreshToken);

    return tokens;
  }

  // регистрация... что-то мне не нравится ее логика, переписать. Тут без выдачи токенов, пользователь ещё не вошёл. А вот подтверждение на почту - тут
  async signUp(createUserDto: CreateUserDto): Promise<IJwtTokens> {
    // Hash password (просто дёргать создание юзера)
    // const hash = await this.hashData(createUserDto.password);
    // Promise<Partial<Hotel> & { id: ID }>

    const newUser = await this.usersService.createUser(createUserDto);

    const tokens = await this.getTokens({
      sub: (newUser as UserWithId).id, // TODO: вроде изящнее можно было сделать
      email: newUser.email,
      role: newUser.role,
    });

    await this.updateRefreshToken(
      (newUser as UserWithId).id,
      tokens.refreshToken,
    );

    return tokens;
  }

  // войти в систему, залогиниться
  async signIn(loginData: AuthDto): Promise<IJwtTokens> {
    // TODO: доработать метод так, чтобы в "рефреш токенс" юзера также записывались данные об айпи-адресе, устройстве и браузере. Если что-то из этого новое - высылать пользователю на почту уведомлению о входе с нового устройства/браузера/места. Не тут, но: предлагать запомнить конкретное устройство, показывать список устройств на фронтенде на которых залогинен пользователь. Реализовать возможность разлогинится как на конкретном устройстве, так и на всех, кроме текущего.
    // Check if user exists
    const user = await this.usersService.findUserByEmail(loginData.email);
    // console.log(user);
    // Тоже лишний блок, по сути. Но на всякий случай пусть будет.
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    // const passwordMatches = await argon2.verify(user.password, data.password);
    const passwordMatches = await comparePasswords(
      loginData.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect'); // константы
    }

    const tokens = await this.getTokens({
      sub: (user as UserWithId).id,
      email: user.email,
      role: user.role,
    });

    await this.updateRefreshToken((user as UserWithId).id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: ID): Promise<User> {
    return this.usersService.updateUser(userId, { refreshToken: null });
  }

  async activateProfile(activationLink: string): Promise<void> {
    return await this.usersService.activateUserProfile(activationLink);
  }

  // hashData(data: string) {
  //   return argon2.hash(data);
  // }
}
