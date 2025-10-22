import { Module } from '@nestjs/common';
import { PaymentClientModule } from './client/payment-client.module';

@Module({
  imports: [PaymentClientModule],
})
export class PaymentModule {}
