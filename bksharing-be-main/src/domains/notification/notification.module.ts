import { Global, Module } from '@nestjs/common';
import { CommonModule } from 'src/services/common.module';
import { FcmModule } from 'src/services/fcm/fcm.module';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
@Module({
  imports: [CommonModule, FcmModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService, NotificationGateway],
})
@Global()
export class NotificationModule {}
