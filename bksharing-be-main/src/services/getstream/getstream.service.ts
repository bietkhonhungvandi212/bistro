import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StreamClient } from '@stream-io/node-sdk';
import { GETSTREAM_API_KEY, GETSTREAM_API_SECRET, GETSTREAM_WEBHOOK_URL } from 'src/app.config';
import { AuthRequestDTO } from 'src/domains/auth/dto/auth-request.dto';
import { AudioCallChannel } from 'src/shared/constants/event.constant';
import { GetstreamREQ } from './request/getstream.request';

@Injectable()
export class GetStreamService implements OnModuleInit {
  private readonly streamClient: StreamClient;
  private logger = new Logger(GetStreamService.name);
  constructor(private readonly eventEmitter: EventEmitter2) {
    this.streamClient = new StreamClient(GETSTREAM_API_KEY, GETSTREAM_API_SECRET, { timeout: 10000 });
    this.logger.log('StreamClient initialized');
  }
  async onModuleInit() {
    try {
      await this.streamClient.updateApp({
        webhook_url: GETSTREAM_WEBHOOK_URL,
      });
    } catch (err) {
      this.logger.error(err.message);
    }
  }

  createCallToken(request: GetstreamREQ) {
    try {
      this.streamClient.generateCallToken(request as any);
    } catch (e) {
      this.logger.error(e);
    }
  }

  emitEvent(payload: any) {
    switch (payload.type) {
      case AudioCallChannel.LEAVE_CALL:
        this.eventEmitter.emit(AudioCallChannel.LEAVE_CALL, payload);
        break;
      default:
        break;
    }
  }

  verifyWebhook(req: AuthRequestDTO, body: any) {
    try {
      const signature = Array.isArray(req.headers['x-signature']) ? req.headers['x-signature'][0] : req.headers['x-signature'];
      const isVerified = this.streamClient.verifyWebhook(JSON.stringify(body), signature);
      if (!isVerified) {
        throw new Error('Webhook verification failed');
      }
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async createCall(request: any) {
    try {
      await this.streamClient.video.getOrCreateCall(request);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
