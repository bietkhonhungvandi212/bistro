import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackClientService } from './feedback-client.service';

describe('FeedbackClientService', () => {
  let service: FeedbackClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackClientService],
    }).compile();

    service = module.get<FeedbackClientService>(FeedbackClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
