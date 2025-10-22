import { Module } from '@nestjs/common';
import { AccountModule } from 'src/domains/accounts/accounts.module';
import { FeedbackAdminController } from './feedback-admin.controller';
import { FeedbackAdminService } from './feedback-admin.service';

@Module({
  imports: [AccountModule],
  controllers: [FeedbackAdminController],
  providers: [FeedbackAdminService],
})
export class FeedbackAdminModule {}
