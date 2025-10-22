import { Module } from '@nestjs/common';
import { AuthModule } from 'src/domains/auth/auth.module';
import { CommonModule } from 'src/services/common.module';
import { CourseListFactory } from '../factory/course-list.factory';
import { CourseClientController } from './course-client.controller';
import { CourseClientService } from './course-client.service';

@Module({
  imports: [CommonModule, AuthModule],
  controllers: [CourseClientController],
  providers: [CourseClientService, CourseListFactory],
  exports: [CourseClientService],
})
export class CourseClientModule {}
