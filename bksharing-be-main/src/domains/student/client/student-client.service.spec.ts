import { Test, TestingModule } from '@nestjs/testing';
import { StudentClientService } from './student-client.service';

describe('StudentClientService', () => {
  let service: StudentClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentClientService],
    }).compile();

    service = module.get<StudentClientService>(StudentClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
