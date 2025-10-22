import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackAdminController } from './feedback-admin.controller';
import { FeedbackAdminService } from './feedback-admin.service';

describe('FeedbackAdminController', () => {
  let controller: FeedbackAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackAdminController],
      providers: [FeedbackAdminService],
    }).compile();

    controller = module.get<FeedbackAdminController>(FeedbackAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
