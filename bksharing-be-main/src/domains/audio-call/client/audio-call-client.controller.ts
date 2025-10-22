import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { Roles } from 'src/domains/auth/auth-role.decorator';
import { AuthRoleGuard } from 'src/domains/auth/auth-role.guard';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { PaginationResponse } from 'src/shared/generics/pagination.response';
import { AudioCallClientService } from './audio-call-client.service';
import { AudioCallClientListREQ } from './request/audio-call-client-list.request';

@Controller('client/audio-call')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.STUDENT, AccountType.MENTOR)
export class AudioCallClientController {
  constructor(private readonly audioCallClientService: AudioCallClientService) {}

  @Get()
  async list(@Req() req: AuthRequestDTO, @Query() query: AudioCallClientListREQ) {
    const data = await this.audioCallClientService.list(req.user, query);

    return PaginationResponse.ofWithTotal(data.callDTOs, data.count);
  }
}
