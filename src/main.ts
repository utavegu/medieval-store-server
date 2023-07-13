import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ExtendedException } from './extended-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api').useGlobalFilters(new ExtendedException());

  await app.listen(3000);
}
bootstrap();
