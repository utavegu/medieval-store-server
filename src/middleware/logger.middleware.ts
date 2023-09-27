/* eslint-disable prettier/prettier */
import { format } from 'date-fns';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as os from 'os';

// TODO: Ещё бы неплохо (а может и плохо), чтобы он самоподчищался как-нибудь раз во сколько-нибудь

export function LoggerMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const date = format(new Date(), 'dd/MM/yyyy - hh:mm:ss');
  const { url, method, headers, hostname } = request;
  const data = `Date: ${date}\nMethod: ${method}\nHost: ${hostname}\nEndpoint: ${url}\nUser-Agent: ${headers['user-agent']}\nAccept-Language: ${headers['accept-language'] ? headers['accept-language'] : 'нет данных'}\n`;

  // TODO: Нафига я тебя в срц сохраняю, кстати?
  fs.appendFile('src/requests.log', data + os.EOL, (error) => {
    if (error) throw error;
  });

  next();
}
