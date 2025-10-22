import { Module } from '@nestjs/common';
import { AccountModule } from '../accounts/accounts.module';
import { FeedbackClientModule } from '../feedback/client/feedback-client.module';
import { SubscriptionClientModule } from '../subscription/client/subscription-client.module';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [AccountModule, SubscriptionClientModule, FeedbackClientModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
