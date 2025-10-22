import { Module } from '@nestjs/common';
import { DashboardAdminModule } from './admin/dashboard-admin.module';
import { DashboardClientModule } from './client/dashboard-client.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [DashboardAdminModule, DashboardClientModule],
})
export class DashboardModule {}
