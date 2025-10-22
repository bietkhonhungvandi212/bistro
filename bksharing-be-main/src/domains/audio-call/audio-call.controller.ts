import { Controller, Get, Param, ParseIntPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { BaseResponse } from 'src/shared/generics/base.response';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import { AuthRequestDTO } from '../auth/dto/auth-request.dto';
import { AudioCallService } from './audio-call.service';

@Controller('audio-call')
@UseGuards(AuthJwtGuard)
export class AudioCallController {
  constructor(private readonly AudioCallService: AudioCallService) {}

  @Get(':id/participants')
  async participants(@Param('id', ParseIntPipe) roomId: number) {
    const participants = await this.AudioCallService.getAudioCallParticipants(roomId);
    return BaseResponse.of(participants);
  }

  @Get(':id/histories')
  async histories(@Param('id', ParseIntPipe) roomId: number) {
    const histories = await this.AudioCallService.getAudioCallHistory(roomId);
    return BaseResponse.of(histories);
  }

  @Patch(':id/join')
  async join(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) roomId: number) {
    const room = await this.AudioCallService.joinAudioCall(req.user, roomId);
    return BaseResponse.of(room);
  }

  @Patch(':id/leave')
  async leave(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) roomId: number) {
    const room = await this.AudioCallService.leaveAudioCall(req.user.accountId, roomId);
    return BaseResponse.of(room);
  }

  @Patch(':id/start')
  async start(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) roomId: number) {
    const room = await this.AudioCallService.startAudioCall(req.user, roomId);
    return BaseResponse.of(room);
  }

  @Patch(':id/end')
  async end(@Req() req: AuthRequestDTO, @Param('id', ParseIntPipe) roomId: number) {
    const room = await this.AudioCallService.endAudioCall(req.user, roomId);
    return BaseResponse.of(room);
  }
}
