import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackClientController } from './feedback-client.controller';
import { FeedbackClientService } from './feedback-client.service';

describe('FeedbackClientController', () => {
  let controller: FeedbackClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackClientController],
      providers: [FeedbackClientService],
    }).compile();

    controller = module.get<FeedbackClientController>(FeedbackClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
