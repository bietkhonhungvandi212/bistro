import { Test, TestingModule } from '@nestjs/testing';
import { MentorClientController } from './mentor-client.controller';
import { MentorClientService } from './mentor-client.service';

describe('MentorClientController', () => {
  let controller: MentorClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MentorClientController],
      providers: [MentorClientService],
    }).compile();

    controller = module.get<MentorClientController>(MentorClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
