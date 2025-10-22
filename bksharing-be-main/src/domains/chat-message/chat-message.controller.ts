import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { BaseResponse } from 'src/shared/generics/base.response';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import { AuthRequestDTO } from '../auth/dto/auth-request.dto';
import { ChatMessageService } from './chat-message.service';
import { ChatRoomDetailREQ } from './request/chat-room-detail.request';
import { ChatRoomListREQ } from './request/chat-room-list.request';

@Controller('chat-messages')
@UseGuards(AuthJwtGuard)
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Get('rooms')
  async findAll(@Req() req: AuthRequestDTO, @Query() query: ChatRoomListREQ) {
    const { chatRoomDtos, count } = await this.chatMessageService.findAll(req.user, query);

    return PaginationResponse.ofWithTotal(chatRoomDtos, count);
  }

  @Get('rooms/:roomId')
  async detail(@Req() req: AuthRequestDTO, @Param('roomId', ParseIntPipe) roomId: number, @Query() query: ChatRoomDetailREQ) {
    const response = await this.chatMessageService.getAllMessagesByRoomId(req.user, roomId, query);

    return BaseResponse.of(response);
  }
}
