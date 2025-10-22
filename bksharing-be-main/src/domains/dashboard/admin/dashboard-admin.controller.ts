import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { BaseResponse } from 'src/shared/generics/base.response';
import { StatisticOverviewListREQ } from '../request/statistic-overview-list.request';
import { StatisticPaymentListREQ } from '../request/statistic-payment-list.request';
import { StatisticSubscriptionListREQ } from '../request/statistic-subscription-list.request';
import { DashboardAdminService } from './dashboard-admin.service';

@Controller('admin/dashboard')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class DashboardAdminController {
  constructor(private readonly dashboardAdminService: DashboardAdminService) {}

  @Get('overview')
  async getOverviewStatistic(@Query() query: StatisticOverviewListREQ) {
    const res = await this.dashboardAdminService.getOverviewStatistic(query);

    return BaseResponse.of(res);
  }

  @Get('payments')
  async getPaymentStatistic(@Query() query: StatisticPaymentListREQ) {
    const res = await this.dashboardAdminService.getPaymentStatistic(query);

    return BaseResponse.of(res);
  }

  @Get('subscriptions')
  async getSubscriptionStatistic(@Query() query: StatisticSubscriptionListREQ) {
    const res = await this.dashboardAdminService.listSubscription(query);

    return BaseResponse.of(res);
  }
}
