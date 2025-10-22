import { Module } from '@nestjs/common';
import { MentorAdminModule } from './admin/mentor-admin.module';
import { MentorClientModule } from './client/mentor-client.module';

@Module({
  imports: [MentorClientModule, MentorAdminModule],
})
export class MentorModule {}
