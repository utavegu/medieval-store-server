import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { ProductsModule } from '../products/products.module';
import { FilesModule } from '../files/files.module';

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
    ProductsModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
