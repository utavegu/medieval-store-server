import {
  Controller,
  Request,
  Response,
  UseGuards,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { Request as RequestType, Response as ResponseType } from 'express';
import { loginResponseHeaders, refreshTokenCookieOptions } from './auth.config';
import { CreateUserDto } from 'src/modules/users/typing/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from 'src/modules/auth/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/modules/auth/guards/refreshToken.guard';
import { User } from '../users/schemas/user.schema';
import { ID } from 'src/typing/types/id';
import { AuthDto } from './typing/dto/auth.dto';
import { IJwtTokens } from './typing/interfaces/IJwtTokens';

// TODO: Часть методов асинхронные, часть - нет. Освежи этот момент в памяти. Вроде в контроллере асинк-эвэйты не обязательны, лишь бы в сервисах были

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Только незалогиненным пользователям
  @Post('registration')
  signup(@Body() createUserDto: CreateUserDto): Promise<IJwtTokens> {
    return this.authService.signUp(createUserDto);
  }

  // Только незалогиненным пользователям
  // mock password: 1dd2__345A__!f-f+s
  // TODO: А почему успешный ответ 201? Какой ресурс мы создали? Дефолтная реакция на POST-запрос?
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
  refreshTokens(
    @Request()
    request: RequestType & {
      user: Partial<User> & { sub: ID; refreshToken: string };
    },
  ) {
    const { user } = request;
    const userId = user['sub'];
    const refreshToken = user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken); // TODO: тут неправильно - повтори логику из логина
  }

  // TODO: ВРЕМЕННО - защищённая тестовая ручка
  @UseGuards(AccessTokenGuard) // Доступ только с валидным аццесс-токеном в заголовке Authorization: Bearer *
  // Если же ацесс-токен протухший - на клиент вернуть 401 на который тот, в свою очередь, ответит запросом на /refresh, который проверит рефреш-токен, хранящийся в куках, на валидность и что он совпадает с токеном, лежащим в БД у данного юзера. Если всё ок, вернет на клиент новую пару ацесс и рефреш (как при успешном логине)
  @Get('test')
  test(): string {
    return 'Вы получили доступ к защищённому эндпоинту!';
  }
}

// TODO: и в ближайшей перспективе тестовые ручки (тестирование гард) - только залогиненные, только незалогиненные, только клиент с таким же ID, только манагер, только админ.
