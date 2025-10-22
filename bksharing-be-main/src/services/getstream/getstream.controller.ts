import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { GetStreamService } from './getstream.service';

@Controller('getstream')
export class GetStreamController {
  constructor(private readonly getStreamService: GetStreamService) {}

  @Post('webhooks')
  async push(@Body() payload: any, @Req() req: AuthRequestDTO) {
    this.getStreamService.verifyWebhook(req, payload);
    console.log('🚀 ~ AudioCallController ~ push ~ payload:', payload);
    this.getStreamService.emitEvent(payload);
  }
}
