import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { BaseResponse } from 'src/shared/generics/base.response';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { SubscriptionAdminListREQ } from '../dto/request/subscription-admin-list.request';
import { SubscriptionClientListREQ } from '../dto/request/subscription-client-list-request';
import { SubscriptionDetailRESP } from '../dto/response/subscription-detail.response';
import { SubscriptionAdminService } from './subscription-admin.service';

@Controller('admin/subscriptions')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class SubscriptionAdminController {
  constructor(private readonly subscriptionAdminService: SubscriptionAdminService) {}

  @Get()
  async listSubscription(@Query() query: SubscriptionAdminListREQ) {
    const { subscriptionDtos, count } = await this.subscriptionAdminService.listSubscription(query);

    return PaginationResponse.ofWithTotal(subscriptionDtos, count);
  }

  @Get('combination')
  async listCombination(@Query() query: SubscriptionClientListREQ) {
    const subscriptions = await this.subscriptionAdminService.listcombinedSubscriptionByMentorAccount(query);

    return BaseResponse.of(subscriptions);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    const { subscription, mentorData, studentInfo } = await this.subscriptionAdminService.getSubscriptionDetail(id);

    return SubscriptionDetailRESP.fromEntity(
      subscription,
      mentorData.mentor,
      AccountRESP.fromEntity(
        {
          ...studentInfo.account,
          dob: String(studentInfo.account.dob),
        },
        studentInfo.thumbnail,
      ),
      mentorData.thumbnail,
    );
  }

  @Get(':id/combination')
  async detailCombination(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) id: number) {
    const subscriptions = await this.subscriptionAdminService.getSubscriptionCombinedDetail(req.user, id);

    return BaseResponse.of(subscriptions);
  }
}
