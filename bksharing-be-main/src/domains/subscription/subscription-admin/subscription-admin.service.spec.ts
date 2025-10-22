import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionAdminService } from './subscription-admin.service';

describe('SubscriptionAdminService', () => {
  let service: SubscriptionAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionAdminService],
    }).compile();

    service = module.get<SubscriptionAdminService>(SubscriptionAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
