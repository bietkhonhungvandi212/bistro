import { Test, TestingModule } from '@nestjs/testing';
import { PaymentClientController } from './payment-client.controller';
import { PaymentClientService } from './payment-client.service';

describe('PaymentClientController', () => {
  let controller: PaymentClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentClientController],
      providers: [PaymentClientService],
    }).compile();

    controller = module.get<PaymentClientController>(PaymentClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
