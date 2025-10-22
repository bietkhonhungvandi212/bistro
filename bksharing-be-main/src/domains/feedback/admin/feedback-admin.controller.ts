import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { FeedbackListREQ } from '../request/feedback-list.request';
import { FeedbackAdminService } from './feedback-admin.service';

@Controller('admin/feedbacks')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class FeedbackAdminController {
  constructor(private readonly feedbackAdminService: FeedbackAdminService) {}

  @Get('relations')
  async listFeedbackByRelationId(@Query() query: FeedbackListREQ) {
    const data = await this.feedbackAdminService.listByRelation(query);

    return PaginationResponse.ofWithTotal(data.dtos, data.count);
  }
}
