import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  /*
  // TODO: внутри фигурных скобок изначально ничего не было, и возможно то, что я тут нагородил ради кастомной ошибки для интерсептора фронтенда сломает логику (в том числе и доставания юзера на фронтенде) - следи, тести...
  public canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  public handleRequest(err: any, user: any, info: any) {
    if (info) {
      // TODO: Попробуй поизящнее... Ещё и асинк-эвэйты забыл, кстати. Операции с джейсоном асинхронны. Ппц как извращенно выглядит, надо почитать про это info и как с ним работать.
      // TODO: Всё, на фронтенде сделал иначе - через 401 м возможности аксиоса. Но оставлю это тут, так как интересный опыт. И с инфо, всё-таки, желательно разобраться. Но для "чистового варианта" можно вернуть изначальную версию файла - ВЕРНУЛ
      const infoString = JSON.stringify(info);
      const infoJson = JSON.parse(infoString);
      throw new UnauthorizedException(infoJson.name);
    }
    if (err) {
      throw err;
    }
    // if (!user) {
    //   throw new UnauthorizedException(
    //     ERROR_MESSAGES.ONLY_AVAILABLE_AUTHENTICATED_USERS,
    //   );
    // }
    return user; // TODO: переделай, юзера-то тут никакого нет сейчас
  }
  */
}
