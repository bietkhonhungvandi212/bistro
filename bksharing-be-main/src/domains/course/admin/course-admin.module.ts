import { Module } from '@nestjs/common';
import { CourseListFactory } from '../factory/course-list.factory';
import { CourseAdminController } from './course-admin.controller';
import { CourseAdminService } from './course-admin.service';

@Module({
  controllers: [CourseAdminController],
  providers: [CourseAdminService, CourseListFactory],
})
export class CourseAdminModule {}
