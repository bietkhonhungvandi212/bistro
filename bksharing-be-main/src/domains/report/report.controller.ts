import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { BaseResponse } from 'src/shared/generics/base.response';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import { Roles } from '../auth/auth-role.decorator';
import { AuthRoleGuard } from '../auth/auth-role.guard';
import { AuthRequestDTO } from '../auth/dto/auth-request.dto';
import { ReportDetailHelper } from './helper/report-detail.helper';
import { ReportService } from './report.service';
import { ReportClientFeedbackCreateREQ } from './request/report-client-feedback-create.request';
import { ReportClientSubscriptionCreateREQ } from './request/report-client-subscription-create.request';
import { ReportListREQ } from './request/report-list.request';
import { ReportResolveFeedbackREQ } from './request/report-resolve-feeback.request';
import { ReportResolveSubscriptionREQ } from './request/report-resolve-subscription.request';

@Controller('reports')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  @Roles(AccountType.ADMIN, AccountType.STUDENT)
  async list(@Req() req: AuthRequestDTO, @Query() query: ReportListREQ) {
    const { data, count } = await this.reportService.list(req.user, query);

    return PaginationResponse.ofWithTotal(data, count);
  }

  @Post('subscriptions')
  @Roles(AccountType.STUDENT)
  async createSubscriptionReport(@Req() req: AuthRequestDTO, @Body() body: ReportClientSubscriptionCreateREQ) {
    await this.reportService.createSubscriptionReport(req.user, body);

    return BaseResponse.ok();
  }

  @Post('feedbacks')
  @Roles(AccountType.STUDENT)
  async createFeedbackReport(@Req() req: AuthRequestDTO, @Body() body: ReportClientFeedbackCreateREQ) {
    await this.reportService.createReportFeedback(req.user, body);

    return BaseResponse.ok();
  }

  @Get(':reportId')
  @Roles(AccountType.ADMIN, AccountType.STUDENT)
  async detail(@Req() req: AuthRequestDTO, @Param('reportId', ParseIntPipe) reportId: number) {
    const { report, feedback, subscription } = await this.reportService.detail(req.user, reportId);

    const reportDtos = ReportDetailHelper.fromReportEntity(report, { feedback, subscription });

    return BaseResponse.of(reportDtos);
  }

  @Patch(':reportId/feedback-resolutions')
  @Roles(AccountType.ADMIN)
  async resolve(@Param('reportId', ParseIntPipe) reportId: number, @Body() body: ReportResolveFeedbackREQ) {
    await this.reportService.resolveFeedback(reportId, body);

    return BaseResponse.ok();
  }

  @Patch(':reportId/subscription-resolutions')
  @Roles(AccountType.ADMIN)
  async resolveSubscription(@Param('reportId', ParseIntPipe) reportId: number, @Body() body: ReportResolveSubscriptionREQ) {
    await this.reportService.resolveSubscriptionReport(reportId, body);

    return BaseResponse.ok();
  }
}
