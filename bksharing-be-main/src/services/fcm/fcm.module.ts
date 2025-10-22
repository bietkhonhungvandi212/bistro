import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FcmController } from './fcm.controller';
import { FCMService } from './fcm.service';

@Module({
  imports: [PrismaModule],
  controllers: [FcmController],
  providers: [FCMService],
  exports: [FCMService],
})
export class FcmModule {}
