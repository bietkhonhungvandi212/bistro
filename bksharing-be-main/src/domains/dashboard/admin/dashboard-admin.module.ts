import { Module } from '@nestjs/common';
import { AccountModule } from 'src/domains/accounts/accounts.module';
import { MentorClientModule } from 'src/domains/mentor/client/mentor-client.module';
import { DashboardAdminController } from './dashboard-admin.controller';
import { DashboardAdminService } from './dashboard-admin.service';

@Module({
  imports: [AccountModule, MentorClientModule],
  controllers: [DashboardAdminController],
  providers: [DashboardAdminService],
})
export class DashboardAdminModule {}
