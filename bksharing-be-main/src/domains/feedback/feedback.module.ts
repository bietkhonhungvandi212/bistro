import { Module } from '@nestjs/common';
import { FeedbackAdminModule } from './admin/feedback-admin.module';
import { FeedbackClientModule } from './client/feedback-client.module';

@Module({
  imports: [FeedbackClientModule, FeedbackAdminModule],
})
export class FeedbackModule {}
