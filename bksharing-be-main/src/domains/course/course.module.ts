import { Module } from '@nestjs/common';
import { CourseAdminModule } from './admin/course-admin.module';
import { CourseClientModule } from './client/course-client.module';

@Module({
  imports: [CourseClientModule, CourseAdminModule],
  exports: [CourseClientModule],
})
export class CourseModule {}
