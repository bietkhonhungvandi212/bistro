import { Module } from '@nestjs/common';
import { VNP_HASHSECRET, VNP_TMNCODE } from 'src/app.config';
import { VnpayModule } from 'src/services/payment-gateway/vn-pay/vnpay.module';
import { PaymentClientController } from './payment-client.controller';
import { PaymentClientService } from './payment-client.service';

@Module({
  imports: [
    VnpayModule.register({
      tmnCode: VNP_TMNCODE,
      secureSecret: VNP_HASHSECRET,
    }),
  ],
  controllers: [PaymentClientController],
  providers: [PaymentClientService],
  exports: [PaymentClientService],
})
export class PaymentClientModule {}
