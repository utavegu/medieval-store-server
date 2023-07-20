/* eslint-disable newline-per-chained-call */
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { Request as RequestType } from 'express';

// !!! TODO !!!

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh', // если будешь нижний вариант использовать, не забудь и в гардах эту строчку поменять. Но попробуй всё-таки поизучать крайнюю статью из хрома
) {
  constructor() {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // TODO: не отсюда, из кукисов
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
      ]),
      secretOrKey: '123', // process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  private static extractJWT(request: RequestType): string | null {
    if (
      request.cookies &&
      'refreshToken' in request.cookies
      // && request.cookies.user_token.length > 0
    ) {
      return request.cookies.refreshToken;
    }
    return null;
  }

  // validate(req: Request, payload: any) {
  //   const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim(); // TODO: не отсюда, из кукисов
  //   return { ...payload, refreshToken };
  // }

  public async validate(payload: any) {
    // TODO: ДОДЕЛАТЬ!!!
    console.log('validate');
    console.log(payload);
    return payload;
    // const user = await this.userService.findByEmail(payload.sub);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
  }

  /*
  // TODO: ДОДЕЛАТЬ!!!
  ВОТ ТАК БЫЛО ИЗНАЧАЛЬНО (узнай что там было, когда он доставался из заголовков и возвращай то же самое)
  validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
  */
}

/*
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Вариант для забирания через заголовок Authorization: Bearer ...
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        // ExtractJwt.fromAuthHeaderAsBearerToken(), // Видимо, если нужно разрешить оба варианта извлечения токена - и через заголовок, и из кукисов
      ]),
      // ignoreExpiration: false, // TODO: Разберись в этом параметре
      secretOrKey: process.env.SECRET_OR_KEY, // В идеале должен браться из некоего constructor(private readonly configService: ConfigService), import { ConfigService } from '@nestjs/config';
    });
  }

  private static extractJWT(request: RequestType): string | null {
    if (
      request.cookies &&
      'token' in request.cookies
      // && request.cookies.user_token.length > 0
    ) {
      return request.cookies.token;
    }
    return null;
  }

  public async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

/*
Можно валидэйт чутка перепилить:
 async validate(payload: any) {
    // validating payload here
		if (<user is authenticated>) {
			return <user data here>
		}

		// return 401 Unauthorized error
    return null;
  }
*/
