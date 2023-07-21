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
    .useStaticAssets(resolve(__dirname, '../public'))
    .use(cookieParser());

  await app.listen(process.env.SERVER_INTERNAL_PORT || 3000);
}
bootstrap();
