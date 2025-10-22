import { DynamicModule, Module } from '@nestjs/common';
import { VNPAY_MODULE_OPTIONS, VnpayModuleOptions } from './shared/vnpay.type';
import { VnpayService } from './vnpay.service';

@Module({})
export class VnpayModule {
  static register(options: VnpayModuleOptions): DynamicModule {
    return {
      module: VnpayModule,
      providers: [{ provide: VNPAY_MODULE_OPTIONS, useValue: options }, VnpayService],
      exports: [VnpayService],
    };
  }
}
