import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_SERVICE_NAME}:${
        process.env.MONGODB_INTERNAL_PORT || 27017
      }`,
      {
        user: process.env.MONGODB_LOGIN || 'root',
        pass: process.env.MONGODB_PASSWORD || 'example',
        dbName: process.env.DB_NAME,
      },
    ),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
