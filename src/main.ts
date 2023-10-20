import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { resolve } from 'path';
import { AppModule } from './modules/app/app.module';
import { ExtendedException } from './extended-exception.filter';
import { ValidationPipe } from './validation/validation.pipe';
import { LoggerMiddleware } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app
    .setGlobalPrefix('api')
    .useGlobalFilters(new ExtendedException())
    .useGlobalPipes(new ValidationPipe())
    .use(LoggerMiddleware)
    .useStaticAssets(resolve(__dirname, '../public')) // не забывай, что само "public" будет игнорироватсья в итоговом пути
    .use(cookieParser())
    .enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3001'], // енв, конфиг, зависимость от ноденв-продакшн. И разберись ещё потом - внешний или внутренний порт фронтенда нужно указывать.
      credentials: true,
      optionsSuccessStatus: 200,
    });

  await app.listen(process.env.SERVER_INTERNAL_PORT || 4000);
}
bootstrap();
