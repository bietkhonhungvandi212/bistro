import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { BaseResponse } from 'src/shared/generics/base.response';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { CourseAdminListREQ } from '../factory/list/course-admin-list.request';
import { CourseAdminService } from './course-admin.service';
import { CourseApproveREQ } from './request/course-approve.request';
import { CourseAdminDetailRESP } from './response/course-admin-detail.response';

@Controller('admin/courses')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class CourseAdminController {
  constructor(private readonly courseAdminService: CourseAdminService) {}

  @Get()
  async list(@Req() req: AuthRequestDTO, @Query() query: CourseAdminListREQ) {
    const { dtos, count } = await this.courseAdminService.list(req.user, query);

    return PaginationResponse.ofWithTotal(dtos, count);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    const { course, sectionDtos, image } = await this.courseAdminService.detail(id);

    const response = CourseAdminDetailRESP.fromEntity(course, sectionDtos, image);
    return BaseResponse.of(response);
  }

  @Patch(':id/approve')
  async approve(@Param('id', ParseIntPipe) id: number, @Body() body: CourseApproveREQ) {
    const course = await this.courseAdminService.approve(id, body);

    return BaseResponse.of(course);
  }
}
