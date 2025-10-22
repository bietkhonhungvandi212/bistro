import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AudioCallChannel } from 'src/shared/constants/event.constant';
import { AudioCallService } from './audio-call.service';
import { AudioRoomSessionParticipantLeave } from './shared/types';

@Injectable()
export class AudioCallGateway {
  private readonly logger = new Logger(AudioCallGateway.name);
  constructor(private readonly audioCallService: AudioCallService) {}

  @OnEvent(AudioCallChannel.LEAVE_CALL)
  async handleParticipantSessionLeave(payload: AudioRoomSessionParticipantLeave) {
    const cid = payload.call_cid;
    this.logger.log('🚀 ~ AudioCallGateway ~ handleParticipantSessionLeave ~ cid:', cid);

    const roomId = cid.split('-')[1];
    if (!payload) {
      return;
    }

    await this.audioCallService.leaveAudioCall(Number(payload.participant.user.id), Number(roomId));
  }
}
