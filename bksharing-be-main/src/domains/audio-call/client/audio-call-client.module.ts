import { Module } from '@nestjs/common';
import { CommonModule } from 'src/services/common.module';
import { AudioCallClientController } from './audio-call-client.controller';
import { AudioCallClientService } from './audio-call-client.service';

@Module({
  imports: [CommonModule],
  controllers: [AudioCallClientController],
  providers: [AudioCallClientService],
})
export class AudioCallClientModule {}
