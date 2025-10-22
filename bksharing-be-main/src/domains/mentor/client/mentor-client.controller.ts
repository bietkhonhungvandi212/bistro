import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Public } from 'src/domains/auth/auth-public.decorator';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { FeedbackClientService } from 'src/domains/feedback/client/feedback-client.service';
import { MentorClientListREQ } from 'src/domains/mentor/admin/request/mentor-client-list.request';
import { MentorClientDetailRESP } from 'src/domains/mentor/admin/response/mentor-client-detail.response';
import { BaseResponse } from 'src/shared/generics/base.response';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { MentorClientService } from './mentor-client.service';
import { MentorScheduleService } from './mentor-schedule.service';
import { MentorClientAchievementCreateREQ } from './request/mentor-client-achievement-create.request';
import { MentorClientAchievementUpdateREQ } from './request/mentor-client-achievement-update.request';
import { MentorClientCourseListREQ } from './request/mentor-client-course-list.request';
import { MentorClientRecommendREQ } from './request/mentor-client-recommend.request';
import { MentorClientScheduleCreateREQ } from './request/mentor-client-schedule-create.request';
import { MentorClientScheduleUpdateREQ } from './request/mentor-client-schedule-update.request';
import { MentorClientUpdateREQ } from './request/mentor-client-update.request';

@Controller('client/mentors')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MENTOR)
export class MentorClientController {
  constructor(
    private readonly mentorClientService: MentorClientService,
    private readonly mentorSchduleService: MentorScheduleService,
    private readonly feedbackClientService: FeedbackClientService,
  ) {}

  @Get()
  @Public()
  async list(@Query() query: MentorClientListREQ) {
    const response = await this.mentorClientService.list(query);

    return PaginationResponse.ofWithTotal(response.mentorsDTO, response.count);
  }

  @Get('profile')
  async profile(@Req() req: AuthRequestDTO) {
    const response = await this.mentorClientService.getMentorByAccountId(req.user.accountId);

    return BaseResponse.of(
      MentorClientDetailRESP.fromEntity(response.mentor, response.achievements, response.statisticData, response.thumbnail),
    );
  }

  @Post('recommendations')
  @Roles(AccountType.STUDENT)
  async listRecommendations(@Req() req: AuthRequestDTO, @Body() body: MentorClientRecommendREQ) {
    const response = await this.mentorClientService.getMentorsRecommendation(body);

    return BaseResponse.of(response);
  }

  @Post('schedules')
  async createSchedule(@Req() req: AuthRequestDTO, @Body() body: MentorClientScheduleCreateREQ) {
    await this.mentorSchduleService.createScheduleByAccountId(req.user, body);

    return BaseResponse.ok();
  }

  @Get('schedules')
  async getSchedule(@Req() req: AuthRequestDTO) {
    const response = await this.mentorSchduleService.getSchedulesByAccountId(req.user.accountId);

    return BaseResponse.of(response);
  }

  @Get('schedules/durations')
  async getScheduleDurations(@Req() req: AuthRequestDTO) {
    const response = await this.mentorSchduleService.getScheduleDurationsByAccountId(req.user.accountId);

    return BaseResponse.of(response);
  }

  @Roles(AccountType.MENTOR, AccountType.STUDENT)
  @Get(':id/schedules/courses/:courseId')
  async getScheduleByMentorId(@Param('id', ParseIntPipe) mentorId: number, @Param('courseId', ParseIntPipe) courseId: number) {
    const response = await this.mentorSchduleService.getSchedulesOfCourseByMentorId(mentorId, courseId);

    return BaseResponse.of(response);
  }

  @Get(':mentorId/feedbacks')
  async listFeedbackByMentorId(@Param('mentorId', ParseIntPipe) mentorId: number) {
    const data = await this.feedbackClientService.listFeedbackByMentorId(mentorId);

    return PaginationResponse.ofWithTotal(data.dtos, data.count);
  }

  @Put('schedules/:id') async updateSchedule(
    @Req() req: AuthRequestDTO,
    @Param('id', ParseIntPipe) scheduleId: number,
    @Body() body: MentorClientScheduleUpdateREQ,
  ) {
    await this.mentorSchduleService.updateMentorSchedule(req.user, scheduleId, body);

    return BaseResponse.ok();
  }

  @Delete('schedules/:id') async deleteSchedule(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) scheduleId: number) {
    await this.mentorSchduleService.deleteScheduleById(req.user.accountId, scheduleId);

    return BaseResponse.ok();
  }

  @Get(':id')
  @Public()
  async detail(@Param('id', ParseIntPipe) mentorId: number) {
    const response = await this.mentorClientService.detail(mentorId);

    return BaseResponse.of(
      MentorClientDetailRESP.fromEntity(response.mentor, response.achievements, response.statisticData, response.thumbnail),
    );
  }

  @Roles(AccountType.MENTOR, AccountType.STUDENT)
  @Get(':id/courses')
  async getCoursesByMentorId(
    @Req() req: AuthRequestDTO,
    @Param('id', ParseIntPipe) mentorId: number,
    @Query() query: MentorClientCourseListREQ,
  ) {
    const response = await this.mentorClientService.getCoursesByMentorId(mentorId, req.user, query);

    return BaseResponse.of(response);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) mentorId: number, @Req() req: AuthRequestDTO, @Body() body: MentorClientUpdateREQ) {
    const response = await this.mentorClientService.update(mentorId, req.user, body);

    return BaseResponse.of(response.id);
  }

  @Post(':id/achievements')
  async addProfileAchievement(
    @Param('id', ParseIntPipe) mentorId: number,
    @Body() body: MentorClientAchievementCreateREQ,
    @Req() req: AuthRequestDTO,
  ) {
    const response = await this.mentorClientService.addProfileAchievement(mentorId, body, req.user);

    return BaseResponse.of(response);
  }

  @Patch(':id/achievements')
  async updateAchievements(
    @Param('id', ParseIntPipe) mentorId: number,
    @Body() body: MentorClientAchievementUpdateREQ,
    @Req() req: AuthRequestDTO,
  ) {
    const response = await this.mentorClientService.updateAchievements(mentorId, body, req.user);

    return BaseResponse.of(response);
  }

  @Post(':id/viewCounts')
  @Roles(AccountType.STUDENT)
  async increaseViewCount(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) mentorId: number) {
    await this.mentorClientService.upsertCountView(req.user, mentorId);

    return BaseResponse.ok();
  }

  @Delete(':id/achievements/:achievementId')
  async deleteAchievement(
    @Param('id', ParseIntPipe) mentorId: number,
    @Param('achievementId', ParseIntPipe) achievementId: number,
    @Req() req: AuthRequestDTO,
  ) {
    const response = await this.mentorClientService.deleteAchievement(mentorId, achievementId, req.user);

    return BaseResponse.of(response);
  }
}
