import { Module } from '@nestjs/common';
import { AccountModule } from 'src/domains/accounts/accounts.module';
import { MentorClientModule } from 'src/domains/mentor/client/mentor-client.module';
import { SubscriptionAdminController } from './subscription-admin.controller';
import { SubscriptionAdminService } from './subscription-admin.service';

@Module({
  imports: [AccountModule, MentorClientModule],
  controllers: [SubscriptionAdminController],
  providers: [SubscriptionAdminService],
})
export class SubscriptionAdminModule {}
