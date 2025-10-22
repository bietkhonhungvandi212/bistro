import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { EMAIL_FROM, EMAIL_HOST, EMAIL_PASSWORD, EMAIL_USER } from 'src/app.config';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        return {
          transport: {
            host: EMAIL_HOST,

            secure: false,
            auth: {
              user: EMAIL_USER,
              pass: EMAIL_PASSWORD,
            },
          },
          defaults: {
            from: `"No Reply" <${EMAIL_FROM}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
