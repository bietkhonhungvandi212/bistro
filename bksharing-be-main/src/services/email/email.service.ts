import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { leanObject } from 'src/shared/parsers/common.parser';
import { EmailPayload, EmailTemplate } from './shared/types';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(private readonly mailService: MailerService) {}

  async sendMail(payload: EmailPayload, template?: EmailTemplate) {
    try {
      const sentEmail = await this.mailService.sendMail({
        to: payload.email,
        subject: payload.subject,
        text: payload.text,
        ...(template.path && leanObject({ template: template.path, context: template.context })),
      });

      this.logger.log('🚀 ~ EmailService ~ sendMail ~ sentEmail:', sentEmail);
    } catch (error) {
      this.logger.error('🚀 ~ EmailService ~ sendMail ~ error:', error);
    }
  }
}
