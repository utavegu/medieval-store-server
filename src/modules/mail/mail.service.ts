import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationMail(to: string, link: string) {
    try {
      await this.mailerService.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Активация аккаунта на "Medieval store"',
        text: '',
        // TODO: А вот тут можно будет вспомнить вёрстку почтовых рассылок и EJS (впрочем, конкретно тут шаблонизатор не нужен)
        html: `
            <div>
              <h1>Активация вашего аккаунта на "Medieval store"</h1>
              <p>Для завершения активации перейдите по <a href="${link}">этой</a> ссылке.</p>
            </div>
          `,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
