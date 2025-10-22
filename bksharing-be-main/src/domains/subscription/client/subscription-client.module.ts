import { forwardRef, Module } from '@nestjs/common';
import { AccountModule } from 'src/domains/accounts/accounts.module';
import { AudioCallModule } from 'src/domains/audio-call/audio-call.module';
import { MentorClientModule } from 'src/domains/mentor/client/mentor-client.module';
import { PaymentClientModule } from 'src/domains/payment/client/payment-client.module';
import { SubscriptionClientController } from './subscription-client.controller';
import { SubscriptionClientService } from './subscription-client.service';

@Module({
  imports: [forwardRef(() => MentorClientModule), AccountModule, PaymentClientModule, AudioCallModule],
  controllers: [SubscriptionClientController],
  providers: [SubscriptionClientService],
  exports: [SubscriptionClientService],
})
export class SubscriptionClientModule {}
