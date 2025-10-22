import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { BaseResponse } from 'src/shared/generics/base.response';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { MentorAdminService } from './mentor-admin.service';
import { MentorAdminApproveREQ } from './request/mentor-admin-approve.request';
import { MentorAdminInterviewREQ } from './request/mentor-admin-interview.request';
import { MentorAdminListREQ } from './request/mentor-admin-list.request';
import { MentorAdminDetailRESP } from './response/mentor-admin-detail.response';
import { MentorAdminInterviewRESP } from './response/mentor-admin-interview.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('admin/mentors')
export class MentorAdminController {
  constructor(private readonly mentorAdminService: MentorAdminService) {}

  @Get()
  async list(@Query() query: MentorAdminListREQ) {
    const response = await this.mentorAdminService.list(query);

    return PaginationResponse.ofWithTotal(response.mentorsDTO, response.count);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) mentorId: number) {
    const response = await this.mentorAdminService.detail(mentorId);

    return BaseResponse.of(
      MentorAdminDetailRESP.fromEntity(response.mentor, response.achievements, response.cv, response.thumbnail),
    );
  }

  @Post(':id/audio-call')
  async interviewMentor(
    @Req() req: AuthRequestDTO,
    @Param('id', ParseIntPipe) mentorId: number,
    @Body() body: MentorAdminInterviewREQ,
  ) {
    const call = await this.mentorAdminService.interviewMentor(req.user, mentorId, body);

    return BaseResponse.of(MentorAdminInterviewRESP.fromEntity(call, call.cid));
  }

  @Patch(':id/approvement')
  async approveMentor(
    @Req() req: AuthRequestDTO,
    @Param('id', ParseIntPipe) mentorId: number,
    @Body() body: MentorAdminApproveREQ,
  ) {
    const call = await this.mentorAdminService.updateResultInterview(req.user, mentorId, body);

    return BaseResponse.of(call.id);
  }
}
