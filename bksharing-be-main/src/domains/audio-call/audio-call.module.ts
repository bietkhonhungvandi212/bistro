import { Module } from '@nestjs/common';
import { ChatMessageModule } from '../chat-message/chat-message.module';
import { AudioCallAdminModule } from './admin/audio-call-admin.module';
import { AudioCallController } from './audio-call.controller';
import { AudioCallGateway } from './audio-call.gateway';
import { AudioCallService } from './audio-call.service';
import { AudioCallClientModule } from './client/audio-call-client.module';

@Module({
  imports: [AudioCallAdminModule, AudioCallClientModule, ChatMessageModule],
  controllers: [AudioCallController],
  providers: [AudioCallService, AudioCallGateway],
  exports: [AudioCallService],
})
export class AudioCallModule {}
