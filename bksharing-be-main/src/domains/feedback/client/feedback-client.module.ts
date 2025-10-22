import { Module } from '@nestjs/common';
import { AccountModule } from 'src/domains/accounts/accounts.module';
import { FeedbackClientController } from './feedback-client.controller';
import { FeedbackClientService } from './feedback-client.service';

@Module({
  imports: [AccountModule],
  controllers: [FeedbackClientController],
  providers: [FeedbackClientService],
  exports: [FeedbackClientService],
})
export class FeedbackClientModule {}
