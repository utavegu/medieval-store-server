import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OnlyGuestGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // TODO: Типизируй
  public handleRequest(err: any, user: any, _info: any) {
    if (err) {
      throw err;
    }

    if (user) {
      throw new ForbiddenException(
        'Доступ только незарегистрированным пользователям!', // TODO: в константы
      );
    }

    return user;
  }
}
