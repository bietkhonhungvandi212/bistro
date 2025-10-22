import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { BaseResponse } from 'src/shared/generics/base.response';
import { StatisticOverviewListREQ } from '../request/statistic-overview-list.request';
import { StatisticPaymentListREQ } from '../request/statistic-payment-list.request';
import { StatisticSubscriptionListREQ } from '../request/statistic-subscription-list.request';
import { StatisticTopCourseListREQ } from '../request/statistic-top-course-list.request';
import { DashboardClientService } from './dashboard-client.service';

@Controller('client/dashboard')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MENTOR)
export class DashboardClientController {
  constructor(private readonly dashboardClientService: DashboardClientService) {}

  @Get('overview')
  async getOverviewStatistic(@Req() req: AuthRequestDTO, @Query() query: StatisticOverviewListREQ) {
    const res = await this.dashboardClientService.getOverviewStatistic(req.user, query);

    return BaseResponse.of(res);
  }

  @Get('payments')
  async getPaymentStatistic(@Req() req: AuthRequestDTO, @Query() query: StatisticPaymentListREQ) {
    const res = await this.dashboardClientService.getPaymentStatistic(req.user, query);

    return BaseResponse.of(res);
  }

  @Get('subscriptions')
  async getSubscriptionStatistic(@Req() req: AuthRequestDTO, @Query() query: StatisticSubscriptionListREQ) {
    const res = await this.dashboardClientService.listSubscription(req.user, query);

    return BaseResponse.of(res);
  }

  @Get('top-courses')
  async getTopCourses(@Req() req: AuthRequestDTO, @Query() query: StatisticTopCourseListREQ) {
    const res = await this.dashboardClientService.getTopCourses(req.user, query);

    console.log('🚀 ~ DashboardClientController ~ getTopCourses ~ res:', res);

    return BaseResponse.of(res);
  }
}
