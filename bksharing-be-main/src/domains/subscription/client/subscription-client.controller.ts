import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AccountRESP } from 'src/domains/accounts/response/account.response';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { BaseResponse } from 'src/shared/generics/base.response';
import { SubscriptionClientListREQ } from '../dto/request/subscription-client-list-request';
import { SubscriptionCreateREQ } from '../dto/request/subscription-create.request';
import { SubscriptionMentorApproveREQ } from '../dto/request/subscription-mentor-approve';
import { SubscriptionPaymentCreateREQ } from '../dto/request/subscription-payment-create';
import { SubscriptionDetailRESP } from '../dto/response/subscription-detail.response';
import { SubscriptionClientService } from './subscription-client.service';

@Controller('client/subscriptions')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class SubscriptionClientController {
  constructor(private readonly subscriptionClientService: SubscriptionClientService) {}

  @Get()
  async list(@Req() req: AuthRequestDTO, @Query() query: SubscriptionClientListREQ) {
    const subscriptions = await this.subscriptionClientService.listSubscriptionByAccount(req.user, query);

    return BaseResponse.of(subscriptions);
  }

  @Get('combination')
  @Roles(AccountType.MENTOR)
  async listCombination(@Req() req: AuthRequestDTO, @Query() query: SubscriptionClientListREQ) {
    const subscriptions = await this.subscriptionClientService.listcombinedSubscriptionByMentorAccount(req.user, query);

    return BaseResponse.of(subscriptions);
  }

  @Roles(AccountType.MENTOR)
  @Get(':id/combination')
  async detailCombination(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) id: number) {
    const subscriptions = await this.subscriptionClientService.getSubscriptionCombinedDetail(req.user, id);

    return BaseResponse.of(subscriptions);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequestDTO) {
    const { subscription, mentorData, studentInfo } = await this.subscriptionClientService.getSubscriptionDetailWithAccount(
      req.user,
      id,
    );

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

  @Patch(':id/cancel')
  @Roles(AccountType.STUDENT)
  async cancel(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) id: number) {
    await this.subscriptionClientService.cancel(req.user, id);

    return BaseResponse.ok();
  }

  @Get('mentors/:mentorId')
  @Roles(AccountType.STUDENT)
  async listByMentor(@Param('mentorId', ParseIntPipe) mentorId: number) {
    const subscriptions = await this.subscriptionClientService.listSubscriptionByMentorId(mentorId);

    return BaseResponse.of(subscriptions);
  }

  @Post('courses/:courseId')
  @Roles(AccountType.STUDENT)
  async createSubscription(
    @Req() req: AuthRequestDTO,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() body: SubscriptionCreateREQ,
  ) {
    const subscription = await this.subscriptionClientService.create(req.user, courseId, body);

    return BaseResponse.of({ subscriptionId: subscription.id });
  }

  @Post(':id/payments')
  @Roles(AccountType.STUDENT)
  async createPayment(
    @Req() req: AuthRequestDTO,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SubscriptionPaymentCreateREQ,
  ) {
    const payment = await this.subscriptionClientService.makePayment(req.user, id, {
      ...body,
      ipAddr: req.ip,
    });

    return BaseResponse.of(payment);
  }

  @Put(':id/payments')
  async continue(
    @Req() req: AuthRequestDTO,
    @Param('id', ParseIntPipe) subscriptionId: number,
    @Body() body: SubscriptionPaymentCreateREQ,
  ) {
    const payment = await this.subscriptionClientService.continue(req.user, subscriptionId, { ...body, ipAddr: req.ip });

    return BaseResponse.of(payment);
  }

  @Patch('approvement')
  @Roles(AccountType.MENTOR)
  async approveSubscription(@Req() req: AuthRequestDTO, @Body() body: SubscriptionMentorApproveREQ) {
    const subscriptionId = await this.subscriptionClientService.approve(req.user, body);

    return BaseResponse.of({ subscriptionId: subscriptionId });
  }
}
