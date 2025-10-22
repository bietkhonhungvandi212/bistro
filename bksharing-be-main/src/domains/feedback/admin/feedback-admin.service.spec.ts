import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackAdminService } from './feedback-admin.service';

describe('FeedbackAdminService', () => {
  let service: FeedbackAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackAdminService],
    }).compile();

    service = module.get<FeedbackAdminService>(FeedbackAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
