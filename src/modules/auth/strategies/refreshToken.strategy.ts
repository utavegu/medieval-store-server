import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../typing/interfaces/JwtPayload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJwtFromCookies,
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  private static extractJwtFromCookies(request: RequestType): string | null {
    if (
      request.cookies &&
      'refreshToken' in request.cookies &&
      request.cookies.refreshToken.length > 0
    ) {
      return request.cookies.refreshToken;
    }
    return null;
  }

  validate(request: RequestType, payload: JwtPayload) {
    const refreshToken = RefreshTokenStrategy.extractJwtFromCookies(request);
    return { ...payload, refreshToken };
  }
}
