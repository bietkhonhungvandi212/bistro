import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { AuthJwtGuard } from 'src/domains/auth/auth-jwt.guard';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { BaseResponse } from 'src/shared/generics/base.response';
import { FCMService } from './fcm.service';
import { FcmRegisterTokenREQ } from './request/fcm-register-token.request';
import { FcmRemoveTokenREQ } from './request/fcm-remove-token.request';

@Controller('fcm')
@UseGuards(AuthJwtGuard)
export class FcmController {
  constructor(private readonly fcmService: FCMService) {}

  @Post('device-tokens')
  async registerToken(@Req() req: AuthRequestDTO, @Body() body: FcmRegisterTokenREQ) {
    return await this.fcmService.registerToken(req.user, body);
  }

  @Delete('device-tokens')
  async removeToken(@Req() req: AuthRequestDTO, @Body() body: FcmRemoveTokenREQ) {
    await this.fcmService.removeToken(req.user, body);

    return BaseResponse.ok();
  }
}
