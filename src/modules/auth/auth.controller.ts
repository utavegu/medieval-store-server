import {
  Controller,
  Request,
  Response,
  UseGuards,
  Get,
  Post,
  Body,
  Param,
  Redirect,
} from '@nestjs/common';
import { Request as RequestType, Response as ResponseType } from 'express';
import { loginResponseHeaders, refreshTokenCookieOptions } from './auth.config';
import { Role } from 'src/decorators/role.decorator';
import { RolesDecorator } from 'src/decorators/roles.decorator';
import { CreateUserDto } from 'src/modules/users/typing/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from 'src/modules/auth/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/modules/auth/guards/refreshToken.guard';
import { RoleGuard } from './guards/role.guard';
import { RolesGuard } from './guards/roles.guard';
import { OnlyGuestGuard } from './guards/only-guest.guard';
import { User } from '../users/schemas/user.schema';
import { ID } from 'src/typing/types/id';
import { AuthDto } from './typing/dto/auth.dto';
import { IJwtTokens } from './typing/interfaces/IJwtTokens';
import { Roles } from '../users/typing/enums/roles.enum';
// TODO: Часть методов асинхронные, часть - нет. Освежи этот момент в памяти. Вроде в контроллере асинк-эвэйты не обязательны, лишь бы в сервисах были (но некоторые-то без них и не взлетят, ибо эвэйты внутри используются, тут всяко оставить придётся)

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(OnlyGuestGuard)
  @Post('registration')
  signup(@Body() createUserDto: CreateUserDto): Promise<IJwtTokens> {
    return this.authService.signUp(createUserDto);
  }

  // TODO: А почему успешный ответ 201? Какой ресурс мы создали? Дефолтная реакция на POST-запрос?
  @UseGuards(OnlyGuestGuard)
  @Post('login')
  async signin(
    @Body() data: AuthDto,
    @Response({ passthrough: true }) response: ResponseType & User,
  ): Promise<{ accessToken: string }> {
    const tokens = await this.authService.signIn(data);
    response
      .cookie('refreshToken', tokens.refreshToken, refreshTokenCookieOptions)
      .set(loginResponseHeaders);
    return { accessToken: tokens.accessToken }; // Для сохранения в локалсторадж на фронтенде.
  }

  // Только залогиненным пользователям
  @UseGuards(AccessTokenGuard)
  // TODO: На фронтенде если оба токена протухли, эта ручка не дёрнется. Нужно будет как-то из базы протухшие токены вычищать и отцеплять протухший токен от пользователя. Затереть на фронтенде при протухании я его тоже не смогу, так как кука хттп-онли
  @Get('logout')
  logout(
    @Request() request: RequestType & { user: Partial<User> & { sub: ID } },
    @Response({ passthrough: true }) response: ResponseType & User,
  ): void {
    this.authService.logout(request.user['sub']);
    response.clearCookie('refreshToken'); // TODO: Странно, что на фронтенде не затирается ни так...
    // response.cookie('refreshToken', '', { expires: new Date() }); // ...ни эдак. А, креденшиалс... коварная штука. Всё, починил.
    return;
  }

  // Логику работы расписал ниже
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Request()
    request: RequestType & {
      user: Partial<User> & { sub: ID; refreshToken: string };
    },
    @Response({ passthrough: true }) response: ResponseType & User,
  ): Promise<{ accessToken: string }> {
    const { user } = request;
    // const userId = user['sub'];
    // const refreshToken = user['refreshToken'];
    const tokens = await this.authService.refreshTokens(
      user['sub'],
      user['refreshToken'],
    );
    response
      .cookie('refreshToken', tokens.refreshToken, refreshTokenCookieOptions)
      .set(loginResponseHeaders);
    return { accessToken: tokens.accessToken };
  }

  @Get('activate/:link')
  // TODO: Валидация! (но нужна ли? на уровне сервиса вполне норм проверяется)
  @Redirect('http://localhost:3000', 301) // TODO: динамичный енв, зависимый от прод/дев. Страница успешной активации профиля
  async activateProfile(@Param('link') link: string): Promise<void> {
    await this.authService.activateProfile(link);
    return;
  }

  @UseGuards(AccessTokenGuard)
  @Get('checkauth')
  checkAuth(): void {
    return;
  }

  // TODO: ВРЕМЕННО - далее - защищённые тестовые ручки

  // Любой залогиненный пользователь
  @UseGuards(AccessTokenGuard) // Доступ только с валидным аццесс-токеном в заголовке Authorization: Bearer *
  // Если же ацесс-токен протухший - на клиент вернуть 401 на который тот, в свою очередь, ответит запросом на /refresh, который проверит рефреш-токен, хранящийся в куках, на валидность и что он совпадает с токеном, лежащим в БД у данного юзера. Если всё ок, вернет на клиент новую пару ацесс и рефреш (как при успешном логине)
  @Get('test')
  test(
    @Request()
    request: RequestType & {
      user: Partial<User> & { sub: ID; refreshToken: string };
    },
  ): string {
    const { user } = request;
    // console.log(user);
    return 'Вы получили доступ к защищённому эндпоинту!';
  }

  // Только незалогиненным пользователям
  @UseGuards(OnlyGuestGuard)
  @Get('test/guest')
  testGuest(): string {
    return 'Ручка только для гостей';
  }

  // Только манагерам
  @Role(Roles.MANAGER)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Get('test/manager')
  testManager(): string {
    return 'Только манагеры';
  }

  // Только админам
  @Role(Roles.ADMIN)
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Get('test/admin')
  testAdmin(): string {
    return 'Только админы';
  }

  // Только админам и манагерам
  @RolesDecorator(Roles.ADMIN, Roles.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('test/employees')
  testEmployees(): string {
    return 'Только админы или манагеры';
  }
}
