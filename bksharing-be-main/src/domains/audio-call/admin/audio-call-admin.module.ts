import { Module } from '@nestjs/common';
import { CommonModule } from 'src/services/common.module';
import { AudioCallAdminController } from './audio-call-admin.controller';
import { AudioCallAdminService } from './audio-call-admin.service';

@Module({
  imports: [CommonModule],
  controllers: [AudioCallAdminController],
  providers: [AudioCallAdminService],
  exports: [AudioCallAdminService],
})
export class AudioCallAdminModule {}
