import { Test, TestingModule } from '@nestjs/testing';
import { MentorClientService } from './mentor-client.service';

describe('MentorClientService', () => {
  let service: MentorClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MentorClientService],
    }).compile();

    service = module.get<MentorClientService>(MentorClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
