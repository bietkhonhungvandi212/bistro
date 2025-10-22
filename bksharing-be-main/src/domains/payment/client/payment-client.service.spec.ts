import { Test, TestingModule } from '@nestjs/testing';
import { PaymentClientService } from './payment-client.service';

describe('PaymentClientService', () => {
  let service: PaymentClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentClientService],
    }).compile();

    service = module.get<PaymentClientService>(PaymentClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
