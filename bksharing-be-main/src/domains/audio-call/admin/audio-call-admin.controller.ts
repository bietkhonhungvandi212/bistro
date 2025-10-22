import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { BaseResponse } from 'src/shared/generics/base.response';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { AuthJwtGuard } from '../../auth/auth-jwt.guard';
import { AuthRequestDTO } from '../../auth/dto/auth-request.dto';
import { AudioCallAdminService } from './audio-call-admin.service';
import { AudioCallAdminListREQ } from './request/audio-call-admin-list.request';

@Controller('admin/audio-call')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class AudioCallAdminController {
  constructor(private readonly audioCallAdminService: AudioCallAdminService) {}

  @Get()
  async list(@Req() req: AuthRequestDTO, @Query() query: AudioCallAdminListREQ) {
    const data = await this.audioCallAdminService.list(req.user, query);

    return PaginationResponse.ofWithTotal(data.callDTOs, data.count);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) roomId: number) {
    const room = await this.audioCallAdminService.detail(roomId);
    return BaseResponse.of(room);
  }
}
