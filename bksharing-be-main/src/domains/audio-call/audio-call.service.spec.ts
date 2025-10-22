import { Test, TestingModule } from '@nestjs/testing';
import { AudioCallService } from './admin/audio-call-admin.service';

describe('AudioCallService', () => {
  let service: AudioCallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AudioCallService],
    }).compile();

    service = module.get<AudioCallService>(AudioCallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
