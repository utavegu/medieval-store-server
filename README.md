Версия ноды: 18.16.0
Версия npm: 9.7.1
Версия nest: 10.1.7
Версия typescript: 5.1.3

Линтеры и хук на прекоммит настроены настроены

Способ разворачивания проекта - через nest new

Часть общего (находится на верхнем уровне, где лежат директории микросервисов) docker-compose.dev.yml, отвечающего за микросервисы сервера.
Допущения для дев-версии файла:
- не все версии образов зафиксированы
- не используются Dockerfile-s
- env захардкожены
- вольюм базы ссылается на директорию хоста (но, возможно, в проде останется так же)
- для удобства соединены через вольюмы приложение в контейнере и на хосте

services:

  mongo:
    container_name: mongo-database-container
    image: mongo
    volumes:
      - ./database:/data/db
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: $MONGODB_LOGIN
      MONGO_INITDB_ROOT_PASSWORD: $MONGODB_PASSWORD

  server:
    container_name: server-container
    image: node:hydrogen-alpine3.16
    working_dir: /medieval-store-server-app
    volumes:
      - ./medieval-store-server:/medieval-store-server-app
    ports:
      - $SERVER_EXTERNAL_PORT:$SERVER_INTERNAL_PORT
    environment:
      - SERVER_INTERNAL_PORT=$SERVER_INTERNAL_PORT
      - MONGODB_SERVICE_NAME=$MONGODB_SERVICE_NAME
      - MONGODB_INTERNAL_PORT=$MONGODB_INTERNAL_PORT
      - MONGODB_LOGIN=$MONGODB_LOGIN
      - MONGODB_PASSWORD=$MONGODB_PASSWORD
      - DB_NAME=$DB_NAME
      - JWT_ACCESS_SECRET=$JWT_ACCESS_SECRET
      - JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
    command: [ "npm", "run", "start:dev" ]
    depends_on:
      - mongo

  mongo-admin-panel:
    container_name: mongo-admin-panel-container
    image: mongo-express
    restart: always
    ports:
      - $MONGO_ADMIN_PANEL_EXTERNAL_PORT:$MONGO_ADMIN_PANEL_INTERNAL_PORT
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: $MONGODB_LOGIN
      ME_CONFIG_MONGODB_ADMINPASSWORD: $MONGODB_PASSWORD
      ME_CONFIG_MONGODB_URL: mongodb://$MONGODB_LOGIN:$MONGODB_PASSWORD@$MONGODB_SERVICE_NAME:$MONGODB_INTERNAL_PORT
    depends_on:
      - mongo
      - server


Для входа в запущенный контейнер используем команду:
docker exec -it ***containername*** /bin/sh

Ещё вчера, после настройки композа, заметил странную проблему. После запуска докер-композ дев-файла директория дист убивается и новая создаётся уже с правами root. Потому npx tsc / nest build в дальнейшем начинают выдавать ошибку. Пока решаю вот так:
sudo chown -R utavegu /home/utavegu/Repositories/medieval-store/medieval-store-server/dist
Но нужно понять, как решить эту проблему глобально. Из мыслей на счёт "почему так получилось" - различий от типовой работы было только 2:
1) В этот раз докер-композ файл лежит ещё выше уровнем, чем корень проекта - то есть пакадж, гит и тд находятся уже каждый в своей директории проекта
2) Работал не в ветке мастер. Но учитывая, что на уровне с композом вообще нет гитовых файлов - гит про него просто не знает.
На данный момент точно понятно, что это происходит только после запуска композ-файла. Если вручную запускать любые скрипты, запускающие тайпскрипт-компилер, dist создаётся с правами текущего пользователя.
Вот тут по этой проблеме:
https://ru.stackoverflow.com/questions/748668/%D0%A4%D0%B0%D0%B9%D0%BB%D1%8B-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D1%8E%D1%82%D1%81%D1%8F-%D0%BE%D1%82-root-%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F


Для токенов:
Вы можете сгенерировать случайный секрет, используя следующую команду:
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"

------------------------

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
