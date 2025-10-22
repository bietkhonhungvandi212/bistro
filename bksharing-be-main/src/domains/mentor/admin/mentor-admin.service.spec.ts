import { Test, TestingModule } from '@nestjs/testing';
import { MentorAdminService } from './mentor-admin.service';

describe('MentorAdminService', () => {
  let service: MentorAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MentorAdminService],
    }).compile();

    service = module.get<MentorAdminService>(MentorAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
