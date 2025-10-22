import { Module } from '@nestjs/common';
import { GetStreamController } from './getstream.controller';
import { GetStreamService } from './getstream.service';

@Module({
  providers: [GetStreamService],
  controllers: [GetStreamController],
  exports: [GetStreamService],
})
export class GetstreamModule {}
