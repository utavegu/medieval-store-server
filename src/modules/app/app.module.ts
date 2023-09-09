import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

// TODOs ниже

@Module({
  imports: [
    MongooseModule.forRoot(
      // И тут, пожалуй, куда-то в другое место бы
      `mongodb://${process.env.MONGODB_SERVICE_NAME}:${
        process.env.MONGODB_INTERNAL_PORT || 27017
      }`,
      {
        user: process.env.MONGODB_LOGIN || 'root',
        pass: process.env.MONGODB_PASSWORD || 'example',
        dbName: process.env.DB_NAME,
      },
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'test'),
    }),
    // TODO: А это точно именно тут должно быть или можно в модуле почты? Поизучай ещё получше настройки nestjs-mailer-а
    MailerModule.forRoot({
      transport: {
        // этот объект в какой-нибудь сетап-файл, пожалуй, лучше.
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 0,
        secure: true, // Ну, по хорошему-то тру
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
    UsersModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
