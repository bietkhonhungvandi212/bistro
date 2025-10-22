import { Module } from '@nestjs/common';
import { AudioCallAdminModule } from 'src/domains/audio-call/admin/audio-call-admin.module';
import { CommonModule } from 'src/services/common.module';
import { MentorAdminController } from './mentor-admin.controller';
import { MentorAdminService } from './mentor-admin.service';

@Module({
  imports: [CommonModule, AudioCallAdminModule],
  controllers: [MentorAdminController],
  providers: [MentorAdminService],
})
export class MentorAdminModule {}
