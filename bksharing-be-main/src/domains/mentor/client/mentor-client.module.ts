import { Module } from '@nestjs/common';
import { AccountModule } from 'src/domains/accounts/accounts.module';
import { CourseClientModule } from 'src/domains/course/client/course-client.module';
import { FeedbackClientModule } from 'src/domains/feedback/client/feedback-client.module';
import { MentorClientController } from './mentor-client.controller';
import { MentorClientService } from './mentor-client.service';
import { MentorScheduleService } from './mentor-schedule.service';

@Module({
  imports: [AccountModule, CourseClientModule, FeedbackClientModule],
  controllers: [MentorClientController],
  providers: [MentorClientService, MentorScheduleService],
  exports: [MentorClientService],
})
export class MentorClientModule {}
