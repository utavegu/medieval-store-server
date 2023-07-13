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
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example

  server:
    container_name: server-container
    image: node:hydrogen-alpine3.16
    working_dir: /medieval-store-server-app
    volumes:
      - ./medieval-store-server:/medieval-store-server-app
    ports:
      - 3000:3000
    environment:
      - SERVER_INTERNAL_PORT=3000
      - MONGODB_SERVICE_NAME=mongo
      - MONGODB_INTERNAL_PORT=27017
      - MONGODB_LOGIN=root
      - MONGODB_PASSWORD=example
      - DB_NAME=medieval-store
    command: [ "npm", "run", "start:dev" ]
    depends_on:
      - mongo

  mongo-admin-panel:
    container_name: mongo-admin-panel-container
    image: mongo-express
    restart: always
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: example
      ME_CONFIG_MONGODB_URL: mongodb://root:example@mongo:27017
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
