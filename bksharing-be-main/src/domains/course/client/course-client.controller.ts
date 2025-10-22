import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Public } from 'src/domains/auth/auth-public.decorator';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { AuthService } from 'src/domains/auth/auth.service';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { BaseResponse } from 'src/shared/generics/base.response';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { CourseSectionDTO } from '../dto/course-section.dto';
import { CourseClientListREQ } from '../factory/list/course-client-list.request';
import { CourseClientService } from './course-client.service';
import { CourseClientCreateREQ } from './request/course-client-create.request';
import { CourseClientUpdateREQ } from './request/course-client-update.request';
import { CourseSectionUpdateDTO } from './request/course-section-client-update.request';

@Controller('client/courses')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MENTOR, AccountType.STUDENT)
export class CourseClientController {
  constructor(
    private readonly courseClientService: CourseClientService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Public()
  async list(@Req() req: AuthRequestDTO, @Query() query: CourseClientListREQ) {
    const { dtos, count } = await this.courseClientService.list(query);

    return PaginationResponse.ofWithTotal(dtos, count);
  }

  @Get('students')
  @Roles(AccountType.STUDENT)
  async getAllCoursesLearnedByStudent(@Req() req: AuthRequestDTO, @Query() query: CourseClientListREQ) {
    const dtos = await this.courseClientService.listCoursesLearnedByAccountId(req.user, query);

    return BaseResponse.of(dtos);
  }

  @Post()
  @Roles(AccountType.MENTOR)
  async create(@Req() req: AuthRequestDTO, @Body() body: CourseClientCreateREQ) {
    const course = await this.courseClientService.create(req.user, body);

    return BaseResponse.of(course);
  }

  @Get(':id')
  @Public()
  async detail(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequestDTO) {
    const jwtToken = req.headers['authorization']?.slice(7);
    const accountId = this.authService.getAccountIdFromToken(jwtToken);

    const course = await this.courseClientService.getPublicCourseDetail(id, accountId);

    return BaseResponse.of(course);
  }

  @Patch(':id')
  @Roles(AccountType.MENTOR)
  async update(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) id: number, @Body() body: CourseClientUpdateREQ) {
    const course = await this.courseClientService.update(id, req.user, body);

    return BaseResponse.of(course);
  }

  @Delete(':id')
  @Roles(AccountType.MENTOR)
  async delete(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) id: number) {
    await this.courseClientService.delete(id, req.user);

    return BaseResponse.ok();
  }

  @Post(':courseId/sections')
  @Roles(AccountType.MENTOR)
  async createSection(
    @Req() req: AuthRequestDTO,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() body: CourseSectionDTO,
  ) {
    const course = await this.courseClientService.createSectionByCourseId(courseId, body, req.user);

    return BaseResponse.of(course);
  }

  @Patch(':courseId/sections/:sectionId')
  @Roles(AccountType.MENTOR)
  async updateSection(
    @Req() req: AuthRequestDTO,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Body() body: CourseSectionUpdateDTO,
  ) {
    const course = await this.courseClientService.updateSectionByCourseId(courseId, sectionId, body, req.user);

    return BaseResponse.of(course);
  }

  @Delete(':courseId/sections/:sectionId')
  @Roles(AccountType.MENTOR)
  async deleteSection(
    @Req() req: AuthRequestDTO,
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('sectionId', ParseIntPipe) sectionId: number,
  ) {
    const course = await this.courseClientService.deleteSectionByCourseId(courseId, sectionId, req.user);

    return BaseResponse.of(course);
  }
}
