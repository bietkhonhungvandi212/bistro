import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Public } from 'src/domains/auth/auth-public.decorator';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { BaseResponse } from 'src/shared/generics/base.response';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { FeedbackCreateREQ } from '../request/feedback-create.request';
import { FeedbackListREQ } from '../request/feedback-list.request';
import { FeedbackUpdateREQ } from '../request/feedback-update.request';
import { FeedbackClientService } from './feedback-client.service';

@Controller('client/feedbacks')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class FeedbackClientController {
  constructor(private readonly feedbackClientService: FeedbackClientService) {}

  @Get()
  @Public()
  async listFeedback(@Query() query: FeedbackListREQ) {
    const data = await this.feedbackClientService.list(query);

    return PaginationResponse.ofWithTotal(data.dtos, data.count);
  }

  @Post()
  @Roles(AccountType.STUDENT)
  async createFeedback(@Req() req: AuthRequestDTO, @Body() body: FeedbackCreateREQ) {
    const feedback = await this.feedbackClientService.create(req.user.accountId, body);

    return BaseResponse.of(feedback);
  }

  @Put(':id')
  @Roles(AccountType.STUDENT)
  async updateFeedback(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) id: number, @Body() body: FeedbackUpdateREQ) {
    const feedback = await this.feedbackClientService.update(req.user.accountId, id, body);

    return BaseResponse.of(feedback);
  }

  @Delete(':id')
  @Roles(AccountType.STUDENT)
  async delete(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) id: number) {
    await this.feedbackClientService.delete(req.user.accountId, id);

    return BaseResponse.ok();
  }
}
