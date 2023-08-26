import { CookieOptions } from 'express';
import { JWT } from 'src/constants';

// TODO!

// https://expressjs.com/ru/api.html#res.cookie
const refreshTokenCookieOptions: CookieOptions = {
  // Недоступны из JavaScript через свойства document.cookie
  httpOnly: true,
  // С атрибутом Strict куки будут отправляться только тому сайту, которому эти куки принадлежат. Задача - для защиты от CSRF аттак, запретит передачу Cookie файлов если переход к вашему API был не с установленого в Cookie домена
  sameSite: 'strict',
  // Срок действия куки (на лёрнджээс почему-то пишут, что в секундах, но тут работает в миллисекундах)
  maxAge: JWT.REFRESH_TOKEN_EXPIRES_IN_DAYS * 3600000 * 24,
  // Отсылаются на сервер только по протоколу SSL или HTTPS. Важный параметр для прода! (тут как раз поиграйся, что если ноденв продакшн, тогда тру, иначе фолс) - process.env.NODE_ENV === 'development' ? false : true
  // secure: true,
  // те URL-адреса, к которым куки будут отсылаться. По умолчанию куки доступны лишь тому домену, который его установил и не передаются поддомену. Потому лучше оставить по-умолчанию (если укажу как у меня тут ниже, то еще и поддомены будут доступны). При необходимости есть ещё path. Задача - чтобы избежать оверхеда при запросах к статичным файлам (публичным картинкам/стилям/js файлам)
  // domain: 'localhost:3000',
};

const loginResponseHeaders = {
  // TODO: не уверен, что правильно установил. Поразбираться в теме установки заголовков. Только ли на эту ручку надо весить, на другие тоже или вообще на уровне настройки сервера (Nginx, Apache). Helmet мэйби.
  'Content-Security-Policy': 'default-src self', // ограничение доверенных доменов для предотвращения возможных XSS атак (вот тут довольно подробно о нем - https://blog.skillfactory.ru/glossary/csp/)
  'X-Frame-Options': 'SAMEORIGIN', // для защиты от атак типа clickjacking
  'X-XSS-Protection': '1; mode=block', // принудительно включить встроенный механизм защиты браузера от XSS атак
  'X-Content-Type-Options': 'nosniff', // для защиты от подмены MIME типов
};

export { refreshTokenCookieOptions, loginResponseHeaders };
