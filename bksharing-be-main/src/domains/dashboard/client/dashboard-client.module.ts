import { Module } from '@nestjs/common';
import { AccountModule } from 'src/domains/accounts/accounts.module';
import { DashboardClientController } from './dashboard-client.controller';
import { DashboardClientService } from './dashboard-client.service';

@Module({
  imports: [AccountModule],
  controllers: [DashboardClientController],
  providers: [DashboardClientService],
})
export class DashboardClientModule {}
