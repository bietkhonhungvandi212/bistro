import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { BaseResponse } from 'src/shared/generics/base.response';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import { AuthRequestDTO } from '../auth/dto/auth-request.dto';
import { NotificationService } from './notification.service';
import { NotificationListREQ } from './request/notification-list.request';
import { NotificationReadREQ } from './request/notification-read.request';

@UseGuards(AuthJwtGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async list(@Req() req: AuthRequestDTO, @Query() query: NotificationListREQ) {
    return await this.notificationService.list(req.user, query);
  }

  @Patch(':id')
  async readNotification(@Param('id', ParseIntPipe) id: number, @Body() body: NotificationReadREQ) {
    const notification = await this.notificationService.readNotification(id, body);

    return BaseResponse.of(notification);
  }
}
