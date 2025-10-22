import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionClientService } from './subscription-client.service';

describe('SubscriptionClientService', () => {
  let service: SubscriptionClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionClientService],
    }).compile();

    service = module.get<SubscriptionClientService>(SubscriptionClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
