import { Module } from '@nestjs/common';
import { SubscriptionClientModule } from './client/subscription-client.module';
import { SubscriptionAdminModule } from './subscription-admin/subscription-admin.module';

@Module({
  imports: [SubscriptionClientModule, SubscriptionAdminModule],
})
export class SubscriptionModule {}
